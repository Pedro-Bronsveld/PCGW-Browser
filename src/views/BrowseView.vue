<script setup lang="ts">
import PCGWApi from '@/api/pcgw-api';
import { getDefaultFilters } from '@/constants/default-filters';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import Filter from '../components/Filter.vue';
import type { SearchGamesOptions } from '@/models/browse/search-games-options';
import { searchGamesOptionsToQueryParams, queryParamsToSearchGamesOptions } from '@/browse/search-games-options-url';

const pcgw = new PCGWApi();

const games = reactive<Map<number, Awaited<ReturnType<typeof pcgw.searchGames>>[number]>>(new Map());
const filters = reactive(getDefaultFilters());
const title = ref("");
const limit = 20;

const router = useRouter();

const updateGames = async (append: boolean = false, count: number = limit) => {
    const searchGamesOptions: SearchGamesOptions = {
        inTitle: title.value,
        filters,
        limit
    };
    const gameResults = await pcgw.searchGames(searchGamesOptions);
    games.clear();
    gameResults.forEach((game, num) => {
        games.set(num, game);
    });

    const newParams = searchGamesOptionsToQueryParams(searchGamesOptions);
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
    const count = Number(locationQuery.count) || limit;
    if (searchGamesOptionsChanged || count !== roundGameCount(games.size, limit) || coldRun) {
        title.value = searchGamesOptions.inTitle;
        updateGames(false, count);
    }
}
watch(queryParams, (locationQuery) => onQueryParamsChanged(locationQuery));

onMounted(() => {
    onQueryParamsChanged(queryParams.value, true);
});

</script>

<template>
    Browse View
    <input type="Button" @click="updateGames()" value="Search" />
    <main class="browseViewContent">
        <div class="filtersList">
            <h2>Filters</h2>
            <h3>Title</h3>
            <label>
                <input type="text" autocomplete="off" placeholder="filter" v-model="title" />
            </label>
            <Filter v-for="filter in filters" :filter="filter" />
        </div>
        <div class="gamesList">
            <h2>Games</h2>
            <ul>
                <li v-for="[num, game] in games">
                    {{ game.page }}
                </li>
            </ul>
        </div>
    </main>
</template>

<style scoped>

.browseViewContent {
    display: flex;
    justify-content: space-between;
    max-width: 900px;
    margin: auto;
}

.gamesList {
    flex-basis: 3;
    flex-grow: 1;
    background-color: lightgray;
}

.filtersList {
    flex-basis: 1;
    flex-grow: 0;
    min-width: 200pt;
    background-color: darkgray;
}

</style>
