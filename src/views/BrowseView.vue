<script setup lang="ts">
import PCGWApi from '@/api/pcgw-api';
import { getDefaultFilters } from '@/constants/default-filters';
import { reactive, ref } from 'vue';
import Filter from '../components/Filter.vue';

const pcgw = new PCGWApi();

const games = reactive<Map<number, Awaited<ReturnType<typeof pcgw.searchGames>>[number]>>(new Map());
const filters = reactive(getDefaultFilters());
const title = ref("");

const searchGames = async () => {
    const gameResults = await pcgw.searchGames(title.value, filters);
    games.clear();
    gameResults.forEach((game, num) => {
        games.set(num, game);
    });
};

</script>

<template>
    Browse View
    <input type="Button" @click="searchGames" value="Search" />
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
