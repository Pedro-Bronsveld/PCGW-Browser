<script setup lang="ts">
import PCGWApi from '@/api/pcgw-api';

const pcgw = new PCGWApi();

const searchGames = () => pcgw.searchGames();

</script>

<template>
    <main>
        Browse View
        <input type="Button" @click="searchGames" value="Search" />
    </main>
</template>
