<script setup lang="ts">
import PCGWApi from '@/api/pcgw-api';
import { getDefaultFilters } from '@/constants/default-filters';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import Filter from '../components/Filter.vue';
import type { SearchGamesOptions } from '@/models/browse/search-games-options';
import { searchGamesOptionsToQueryParams, queryParamsToSearchGamesOptions } from '@/browse/search-games-options-url';
import type Game from '@/models/game';
import { deepCopyObject } from '@/utilities/object-utils';
import { browseFiltersChanged } from '@/browse/browse-filters-changed';
import GameCard from '@/components/GameCard.vue';
import Loader from '@/components/Loader.vue';
import { resetBrowseFilters } from '@/browse/browse-filters-reset';
import { anyBrowseFilters } from '@/browse/browse-filters-any';

const pcgw = new PCGWApi();

const games = reactive<Map<number, Game>>(new Map());
const filters = reactive(getDefaultFilters());
const activeFilters = ref(deepCopyObject(filters));
const enableResetFiltersButton = computed(() => anyBrowseFilters(filters) || title.value !== "");
const title = ref("");
const activeTitle = ref("");
const limit = 20;
const moreAvailable = computed<boolean>(() => games.size > 0 && games.size >= roundGameCount(games.size, limit));
const filtersEqual = computed(() => !browseFiltersChanged(filters, activeFilters.value) && title.value === activeTitle.value);
const updatingGames = ref(false);

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
        inTitle: title.value,
        filters,
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

    // Update query params with new search options values
    activeFilters.value = deepCopyObject(filters);
    activeTitle.value = title.value;
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
    const searchGamesOptions: SearchGamesOptions = {
        inTitle: title.value,
        filters,
        limit
    };
    const searchGamesOptionsChanged = queryParamsToSearchGamesOptions(locationQuery, searchGamesOptions);
    console.log("searchGamesOptionsChanged", searchGamesOptionsChanged);
    const count = Number(locationQuery.limit) || limit;
    if (searchGamesOptionsChanged || count !== roundGameCount(games.size, limit) || coldRun) {
        title.value = searchGamesOptions.inTitle;
        updateGames(false, count);
    }
}
watch(queryParams, (locationQuery) => onQueryParamsChanged(locationQuery));

const loadMore = () => {
    updateGames(true);
}

const resetFilters = () => {
    resetBrowseFilters(filters);
    title.value = "";
    updateGames();
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
                <input type="button" @click="resetFilters" value="Reset Filters" :disabled="!enableResetFiltersButton" />
            </div>
            <h3 class="filterHeading">Title</h3>
            <div class="filterContainer">
                <label>
                    <input class="titleFilter" type="text" autocomplete="off" placeholder="filter" v-model="title" />
                </label>
            </div>
            <template v-for="filter in filters">
                <div class="filterDivider"></div>
                <Filter :filter="filter" />
            </template>
        </div>
        <div class="gamesList">
            <h2 class="heading">Games ({{ uniqueGames.size }})</h2>
            <div class="filtersChanged" v-if="!filtersEqual">
                <p>
                    Filters have changed, run the search again to update results.
                </p>
                <input type="button" @click="updateGames()" value="Search" />
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
    // background-color: var(--grey-light);

    .filtersChanged {
        position: sticky;
        top: 0px;
        background-color: var(--primary-1);
        margin: 10px 0px;
        margin-left: 10px;
        padding: 15px;
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

</style>
