<script setup lang="ts">
import type Game from '@/models/game';
import { coverToThumbnailUrl } from '@/api/cover-url';
import { gamePageToUrl } from '@/api/page-to-url';

const props = defineProps<{
    game: Game
}>();

</script>

<template>
    <a class="gameLink" :href="gamePageToUrl(game.page)">
        <img class="cover" v-if="typeof game.coverUrl === 'string'" :src="coverToThumbnailUrl(game.coverUrl)" loading="lazy" decoding="async" />
        {{ game.page }}
    </a>
</template>

<style scoped lang="scss">

.gameLink {
    display: flex;
    width: 100%;
    text-decoration: none;
    align-items: center;

    &:link, &:visited, &:hover, &:active {
        text-decoration: none;
        color: inherit;
    }
}

.cover {
    /* object-fit: cover; */
    object-fit: contain;
    width: 160px;
    height: 160px;
}

</style>
