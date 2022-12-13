<script setup lang="ts">
import type Game from '@/models/game';
import { coverToThumbnailUrl } from '@/api/cover-url';
import { gamePageToUrl } from '@/api/page-to-url';
import { computed } from 'vue';

const props = defineProps<{
    game: Game
}>();

const releaseDateText = computed(() => [...new Set(
        props.game.releaseDate?.split(";")
        .map(d => {
            const yearMatch = d.match(/[0-9]{4}/);
            if (yearMatch)
                return yearMatch[0]
            return undefined;
        })
        .filter(d => d !== undefined)
    )].join(" • "));

const genresText = computed(() => props.game.genres?.split(",")
    .filter(genre => genre !== "")
    .join(" • ")
    || "");

</script>

<template>
    <a class="gameLink" :href="gamePageToUrl(game.page)">
        <img class="cover" v-if="typeof game.coverUrl === 'string'" :src="coverToThumbnailUrl(game.coverUrl)" loading="lazy" decoding="async" />
        <div class="gameInfo">
            <h3 class="gameTitle" v-html="game.page"></h3>
            <p>{{ releaseDateText }}</p>
            <p>{{ genresText }}</p>
        </div>
    </a>
</template>

<style scoped lang="scss">
@use '../assets/screen.scss';

.gameLink {
    display: flex;
    width: 100%;
    text-decoration: none;
    align-items: center;

    &:link, &:visited, &:hover, &:active {
        text-decoration: none;
        color: inherit;
    }

    .gameInfo {
        margin: 0 10px;
        width: 100%;

        .gameTitle {
            font-weight: normal;
            overflow-wrap: anywhere;
        }
    }
}

.cover {
    object-fit: cover;
    width: 160px;
    min-width: 160px;
    height: 160px;

    @include screen.very-narrow {
        min-width: 100px;
        width: 100px;
    }
}

</style>
