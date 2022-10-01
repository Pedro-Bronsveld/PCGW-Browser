<script setup lang="ts">
import { sortFilterOptions } from '@/browse/filter-options-util';
import type { Filter } from '@/models/browse/filter';
import { computed, ref } from 'vue';

const props = defineProps<{
    filter: Filter
}>();

const showAll = ref(false);
const nameMatch = ref("");

const optionsList = computed(() => {
    const optionsList = [...props.filter.options.values()];
    if (props.filter.sortAlphabetical)
        sortFilterOptions(optionsList, "alphabetical");
    if (!props.filter.valueFilter)
        return optionsList;
    const match = nameMatch.value.trim();
    return match === "" ? optionsList :
    optionsList.filter(option => option.value.toLowerCase().trim()
    .includes(nameMatch.value.toLowerCase().trim()))
    }
);

</script>

<template>
    <h3>{{ filter.title }}</h3>
    <div>
        <label v-if="filter.options.size >= 8">
            <input type="checkbox" v-model="showAll">
            Show all
        </label>
    </div>
    <div v-if="props.filter.sortCheckbox">
        <label>
            <input type="checkbox" v-model="props.filter.sortAlphabetical" />
            Sort alphabetical
        </label>
    </div>
    <div v-if="filter.andCheckbox">
        <label>
            <input type="checkbox" v-model="filter.and" />
            {{ filter.and ? "And" : "Or" }}
        </label>
    </div>
    <div v-if="props.filter.valueFilter">
        <label>
            <input type="text" autocomplete="off" placeholder="filter" v-model="nameMatch" />
        </label>
    </div>
    <ul :class="{ reduce: !showAll }" class="optionsList">
        <li v-for="option in optionsList">
            <input type="checkbox" v-model="option.enabled" />
            {{ option.value }}
        </li>
    </ul>
</template>

<style scoped>

.optionsList.reduce>li:nth-of-type(1n+8) {
    display: none;
}
    
</style>
