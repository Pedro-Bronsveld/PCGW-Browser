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
import ResetButton from '../components/ResetButton.vue';
import MenuButton from '../components/MenuButton.vue';

const pcgw = new PCGWApi();

const games = reactive<Map<number, Game>>(new Map());
const allSortOptions = reactive(getDefaultGameSortOptions());
const limit = 20;
const moreAvailable = computed<boolean>(() => games.size > 0 && games.size >= roundGameCount(games.size, limit));
const updatingGames = ref(false);
const openFiltersMenu = ref(false);

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
    openFiltersMenu.value = false;
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
    const paramLimit = Number(locationQuery.limit);
    const count = paramLimit || limit;
    const roundCount = roundGameCount(games.size, limit);
    if (!searchGamesOptionsChanged && games.size > count) {
        // Handle navigating back after loading more games.
        // Only remove games from the games map.
        [...games.keys()].slice(count).forEach(key => games.delete(key));
    }
    else if (!searchGamesOptionsChanged && games.size < count) {
        // Handle navigating forward and loading more games.
        updateGames(true);
    }
    else if (searchGamesOptionsChanged || (count !== roundCount && count !== games.size) || coldRun) {
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

const toggleFiltersMenu = () => {
    openFiltersMenu.value = !openFiltersMenu.value;
}

onMounted(() => {
    onQueryParamsChanged(queryParams.value, true);
});

</script>

<template>
    <main class="page">
        <div class="searchHeader"
            :class="{
                optionsChanged: !searchOptionsEqual
            }">
            <div class="searchHeaderButtons">
                <div class="buttonGroup">
                    <MenuButton @click="toggleFiltersMenu"
                        :open="openFiltersMenu" />
                    <input type="button" 
                        :class="{
                            secondary: searchOptionsEqual
                        }"
                        class="searchButton"
                        @click="updateGames()"
                        value="Run Search" />
                </div>
                <div class="buttonGroup">
                    <ResetButton
                        value="Reset All"
                        title="Reset all search and sort options"
                        :disabled="!enableResetFiltersButton && sortIsDefault"
                        @click="resetAll" />
                </div>
            </div>
        </div>
        <div class="browseViewColumns">
            <div class="filtersList"
                :class="{
                    open: openFiltersMenu
                }">
                <div class="filtersListHeader">
                    <h2 class="heading">Filters</h2>
                    <ResetButton
                        value="Reset Filters"
                        title="Reset all filters"
                        :disabled="!enableResetFiltersButton"
                        @click="resetFilters()" />
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
            <div class="gamesList"
                :class="{
                    open: openFiltersMenu
                }">
                <div class="gamesListHeader">
                    <h2 class="heading">Games</h2>
                    <div class="sorting">
                        <span class="sortText" >Sort:</span>
                        <select class="sortSelect" v-model="searchOptions.sortColumn">
                            <option v-for="sortOption in allSortOptions" :value="sortOption.value">{{ sortOption.label }}</option>
                        </select>
                        <div class="sortButtons">
                            <input
                                type="checkbox" 
                                v-model="searchOptions.sortDescending"
                                class="textToggle sortToggle"
                                :data-text="searchOptions.sortDescending ? 'Descending' : 'Ascending'"
                                data-spacing="Descending" />
                            <ResetButton
                                value="Reset"
                                title="Reset sort option"
                                :disabled="sortIsDefault"
                                @click="resetSort()" />
                        </div>
                    </div>
                </div>
                <ul>
                    <li class="game" v-for="[num, game] in uniqueGames">
                        <GameCard :game="game" />
                    </li>
                </ul>
                <div classList="gamesListFooter">
                    <p v-if="!updatingGames && games.size === 0" class="noResultsMessage">
                        No games were found for the given search parameters.
                    </p>
                    <Loader v-if="updatingGames" />
                    <input v-else-if="games.size > 0" type="button" value="Load More" @click="loadMore" :disabled="!moreAvailable"/>
                </div>
            </div>

        </div>
    </main>
</template>

<style scoped lang="scss">
@use '../assets/screen';

.heading {
    margin-left: 15px;

    @include screen.very-narrow {
        margin-left: 5px;
    }
}

.filterHeading {
    margin: 13px 15px;
}

.filterContainer {
    display: flex;
    justify-content: start;
    margin: 0 15px;
}

.page {
    max-width: 1024px;
    min-width: 300px;
    margin: auto;
}

.browseViewColumns {
    display: flex;
    justify-content: space-between;
}

.searchHeader {
    top: 0px;
    background-color: var(--grey-light);
    margin: 0px;
    margin-bottom: 10px;
    z-index: 10;
    transition: box-shadow 0.1s;
    box-shadow: 0px 2px 10px 0px var(--grey-medium-dark);
    position: sticky;


    .searchHeaderButtons {
        display: flex;
        justify-content: space-between;
        min-height: 62px;
        margin: 0 15px;

        @include screen.narrow {
            margin-left: 0;
        }

        .buttonGroup {
            display: flex;
            align-items: center;
        }
    }

    &.optionsChanged {
        background-color: var(--primary-1);
    }
}

.gamesList {
    flex-basis: 3;
    flex-grow: 1;

    &.open {
        @include screen.narrow {
            display: none;
        }
    }

    .gamesListHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;

        .sorting {
            display: flex;
            @include screen.very-narrow {
                display: block;
                margin-left: 0;
            }
            align-items: center;
            flex-wrap: wrap;
            margin-left: 10px;
            justify-content: end;

            .sortText, .sortSelect, .sortToggle {
                margin-right: 5px;
            }

            .sortButtons {
                display: flex;
                
                input[type="button"], input[type="checkbox"] {
                    margin-top: 5px;
                    margin-bottom: 5px;
                }
            }
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

            @include screen.narrow {
                margin-left: 0;
            }
        }
    }

    .gamesListFooter {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80px;
        margin-bottom: 50px;

        .noResultsMessage {
            text-align: center;
            margin: 16px;
        }
    }
}

.filtersList {
    flex-basis: 300px;
    flex-grow: 0;
    width: 300px;
    min-width: 300px;
    background-color: var(--grey-light);

    @include screen.narrow {
        &:not(.open) {
            display: none;
        }

        width: 100%;
        flex-grow: 1;

        min-width: 300px;
    }

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

</style>
