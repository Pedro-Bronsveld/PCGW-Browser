<script setup lang="ts">
import PCGWApi from '@/api/pcgw-api';
import { getDefaultFilters } from '@/constants/default-filters';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import Filter from '../components/Filter.vue';
import type { BaseSearchGamesOptions, SearchGamesOptions } from '@/models/browse/search-games-options';
import { searchGamesOptionsToQueryParams, queryParamsToSearchGamesOptions } from '@/browse/search-games-options-url';
import type Game from '@/models/game';
import { deepCopyObject } from '@/utilities/object-utils';
import { browseFiltersChanged } from '@/browse/browse-filters-changed';
import GameCard from '@/components/GameCard.vue';
import Loader from '@/components/Loader.vue';
import { resetBrowseFilters } from '@/browse/browse-filters-reset';
import { anyBrowseFilters } from '@/browse/browse-filters-any';
import { getDefaultGameSortOptions } from '@/constants/default-sort-options';

const pcgw = new PCGWApi();

const games = reactive<Map<number, Game>>(new Map());
const allSortOptions = reactive(getDefaultGameSortOptions());
const limit = 20;
const moreAvailable = computed<boolean>(() => games.size > 0 && games.size >= roundGameCount(games.size, limit));
const updatingGames = ref(false);

const searchOptions = reactive<BaseSearchGamesOptions>({
    inTitle: "",
    filters: getDefaultFilters(),
    sortColumn: "pageId",
    sortDescending: false,
});
const activeSearchOptions = ref(deepCopyObject(searchOptions));

const sortIsDefault = computed(() => searchOptions.sortColumn === "pageId" && searchOptions.sortDescending === false);
const enableResetFiltersButton = computed(() => anyBrowseFilters(searchOptions.filters) || searchOptions.inTitle !== "");
const searchOptionsEqual = computed(() => !browseFiltersChanged(searchOptions.filters, activeSearchOptions.value.filters)
    && searchOptions.inTitle === activeSearchOptions.value.inTitle
    && searchOptions.sortColumn === activeSearchOptions.value.sortColumn
    && searchOptions.sortDescending === activeSearchOptions.value.sortDescending);

// Remove duplicate games.
// Duplicate games can occur when one game has multiple localization entries for the same language.
const uniqueGames = computed<typeof games>(() => {
    const addedGames = new Map<string, Game>();
    const resultGames = new Map<number, Game>();
    games.forEach((game, orderNum) => {
        if (addedGames.has(game.pageId))
            return;
        resultGames.set(orderNum, game);
        addedGames.set(game.pageId, game);
    });
    return resultGames;
});

const router = useRouter();

const updateGames = async (append: boolean = false, count: number = limit) => {
    updatingGames.value = true;
    const searchGamesOptions: SearchGamesOptions = {
        ...searchOptions,
        limit: count,
        offset: append ? games.size : 0
    };
    if(!append)
        games.clear();
    const gameResults = await pcgw.searchGames(searchGamesOptions);
    const { size } = games;
    gameResults.forEach((game, num) => {
        games.set(num + size, game);
    });

    // Update active options variable
    activeSearchOptions.value = deepCopyObject(searchOptions);
    
    // Update query params with new search options values
    console.log("activeSearchGamesOptions", searchGamesOptions);
    const newParams = searchGamesOptionsToQueryParams(searchGamesOptions, games.size > limit ? games.size : undefined);
    updatingGames.value = false;
    router.push({ name: "browse", query: newParams });
};

const roundGameCount = (gameCount: number, baseLimit: number) => {
    const modulo = gameCount % baseLimit;
    return gameCount + (modulo > 0 ? baseLimit - modulo : 0);
}

const route = useRoute();
const queryParams = computed(() => route.query);
const onQueryParamsChanged = (locationQuery: LocationQuery, coldRun: boolean = false) => {
    const searchGamesOptionsChanged = queryParamsToSearchGamesOptions(locationQuery, searchOptions);
    console.log("searchGamesOptionsChanged", searchGamesOptionsChanged);
    const count = Number(locationQuery.limit) || limit;
    if (searchGamesOptionsChanged || count !== roundGameCount(games.size, limit) || coldRun) {
        updateGames(false, count);
    }
}
watch(queryParams, (locationQuery) => onQueryParamsChanged(locationQuery));

const loadMore = () => {
    updateGames(true);
}

const resetFilters = (update = true) => {
    resetBrowseFilters(searchOptions.filters);
    searchOptions.inTitle = "";
    if (update)
        updateGames();
}

const resetSort = (update = true) => {
    searchOptions.sortColumn = "pageId";
    searchOptions.sortDescending = false;
    if (update)
        updateGames();
}

const resetAll = () => {
    resetFilters(false);
    resetSort();
}

onMounted(() => {
    onQueryParamsChanged(queryParams.value, true);
});

</script>

<template>
    <main class="browseViewContent">
        <div class="filtersList">
            <div class="filtersListHeader">
                <h2 class="heading">Filters</h2>
                <input 
                    class="secondary resetButton"
                    type="button" @click="resetFilters()"
                    value="⮌"
                    title="Reset all filters"
                    :disabled="!enableResetFiltersButton" />
            </div>
            <h3 class="filterHeading">Title</h3>
            <div class="filterContainer">
                <label>
                    <input class="titleFilter" type="text" autocomplete="off" placeholder="filter" v-model="searchOptions.inTitle" />
                </label>
            </div>
            <template v-for="filter in searchOptions.filters">
                <div class="filterDivider"></div>
                <Filter :filter="filter" />
            </template>
        </div>
        <div class="gamesList">
            <div class="searchHeader" 
                :class="{
                    optionsChanged: !searchOptionsEqual
                }">
                <div class="searchHeaderButtons">
                    <input type="button" 
                        :class="{
                            secondary: searchOptionsEqual
                        }"
                        class="searchButton" @click="updateGames()" value="Run Search" />
                    <input type="button" 
                        class="resetAllButton secondary resetButton"
                        @click="resetAll"
                        value="⮌"
                        title="Reset all search and sort options"
                        :disabled="searchOptionsEqual" />
                </div>
            </div>
            <div class="gamesListHeader">
                <h2 class="heading">Games</h2>
                <div class="sorting">
                    Sort:
                    <select class="sortSelect" v-model="searchOptions.sortColumn">
                        <option v-for="sortOption in allSortOptions" :value="sortOption.value">{{ sortOption.label }}</option>
                    </select>
                    <input
                        type="checkbox" 
                        v-model="searchOptions.sortDescending"
                        class="textToggle sortToggle"
                        :data-text="searchOptions.sortDescending ? 'Descending' : 'Ascending'"
                        data-spacing="Descending" />
                    <input 
                        type="button"
                        class="resetSort secondary resetButton"
                        value="⮌"
                        title="Reset sort option"
                        @click="resetSort()"
                        :disabled="sortIsDefault"
                    />
                </div>
            </div>
            <ul>
                <li class="game" v-for="[num, game] in uniqueGames">
                    <GameCard :game="game" />
                </li>
            </ul>
            <div classList="gamesListFooter">
                <Loader v-if="updatingGames" />
                <input v-else type="button" value="Load More" @click="loadMore" :disabled="!moreAvailable"/>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">

.heading {
    margin-left: 15px;
}

.filterHeading {
    margin: 13px 15px;
}

.filterContainer {
    display: flex;
    justify-content: start;
    margin: 0 15px;
}

.browseViewContent {
    display: flex;
    justify-content: space-between;
    max-width: 1024px;
    margin: auto;
}

.gamesList {
    flex-basis: 3;
    flex-grow: 1;

    .gamesListHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

        .sorting {
            margin-left: 10px;

            .sortSelect, .sortToggle {
                margin-right: 5px;
            }
        }
    }

    .searchHeader {
        top: 0px;
        background-color: var(--grey-light);
        margin: 0px;
        margin-left: 10px;
        margin-bottom: 10px;
        padding: 15px;
        z-index: 10;
        transition: box-shadow 0.1s;

        .searchHeaderButtons {
            display: flex;
            justify-content: space-between;
        }

        &.optionsChanged {
            position: sticky;
            background-color: var(--primary-1);
            box-shadow: 0px 2px 10px 0px var(--grey-medium-dark);
        }
    }

    ul {
        list-style: none;
        padding: 0;
        
        .game {
            background-color: var(--grey-light);
            margin: 10px 0px;
            margin-left: 10px;
            display: flex;
            align-items: center;

            &:hover {
                background-color: var(--grey-medium-light);
            }
        }
    }

    .gamesListFooter {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80px;
        margin-bottom: 50px;
    }
}

.filtersList {
    flex-basis: 300px;
    flex-grow: 0;
    width: 300px;
    min-width: 300px;
    background-color: var(--grey-light);

    .filtersListHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 15px;
    }

    .filterDivider {
        display: block;
        width: calc(100% - 70px);
        height: 1px;
        margin: 15px 35px;
        background-color: var(--grey-medium);
    }
}

.resetButton {
    font-weight: bold;
}

</style>
