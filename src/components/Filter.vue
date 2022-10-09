<script setup lang="ts">
import { sortFilterOptions } from '@/browse/filter-options-util';
import type { BrowseFilters } from '@/constants/default-filters';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    filter: BrowseFilters[keyof BrowseFilters]
}>();

const showAll = ref(false);
const nameMatch = ref("");
// const picked = ref(props.filter.radio ? [...props.filter.options.values()].find(option => option.enabled)?.value ?? "" : "");
const picked = ref("");
const optionElements = new Map<number, HTMLInputElement>();

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

// Logic for updating picked radio button when the filter object is modified somewhere else.
const updatePicked = () => {
    const pickedOption = [...props.filter.options.values()].find(option => option.enabled);
    picked.value = pickedOption?.value ?? "";
    optionElements.forEach((element, num) => {
        element.checked = num === pickedOption?.number;
    });
}

if (props.filter.radio)
    watch(props.filter, updatePicked);

const onOptionPicked = (number: number) => {
    const pickedOption = props.filter.options.get(number);
    props.filter.options.forEach(option => {
        option.enabled = option.number === pickedOption?.number;
    });
}

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
            <input v-if="filter.radio" :name="filter.title + '-radio'" type="radio" :ref="el => optionElements.set(option.number, el as HTMLInputElement)" :value="option.value" @input="onOptionPicked(option.number)" />
            <input v-else type="checkbox" v-model="option.enabled" />
            {{ option.value }}
        </li>
    </ul>
</template>

<style scoped>

.optionsList.reduce>li:nth-of-type(1n+8) {
    display: none;
}
    
</style>
