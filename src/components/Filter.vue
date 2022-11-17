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
const optionElements = new Map<number, HTMLInputElement | null>();

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
        if (element !== null)
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
    <h3 class="filterTitle">{{ filter.title }}</h3>
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
    <div v-if="filter.valueFilter">
        <label class="nameFilterContainer">
            <input class="nameFilter" type="text" autocomplete="off" placeholder="filter" v-model="nameMatch" />
        </label>
    </div>
    <div class="filterOptionsContainer">
        <input :disabled="optionsList.length < 8" class="showAll" type="checkbox" v-model="showAll" title="Show all">
        <ul :class="{ reduce: !showAll }" class="optionsList">
            <li v-for="option in optionsList">
                <label class="optionLabel">
                    <input v-if="filter.radio" :name="filter.title + '-radio'" type="radio" :ref="el => optionElements.set(option.number, el as HTMLInputElement)" :value="option.value" @input="onOptionPicked(option.number)" :checked="option.enabled" />
                    <input v-else type="checkbox" v-model="option.enabled" />
                    {{ option.value }}
                </label>
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">

.filterTitle {
    margin-left: 15px;
}

.filterOptionsContainer {
    display: flex;
}

.showAll {
    position: relative;
    appearance: none;
    display: block;
    width: 20px;
    margin: 0;
    
    &:enabled {
        background-color: var(--grey-medium-light);
        cursor: pointer;

        &:hover {
            background-color: var(--grey-medium);
        }

        &::after {
            content: ">";
            position: relative;
            top: 100px;
            left: 5px;
        }
    }

    &:checked {
        &::after {
            content: "v";
        }
    }
}

.optionsList {
    list-style: none;
    padding: 0;
    width: 100%;

    .optionLabel {
        display: inline-block;
        width: calc(100% - 5px);
        cursor: pointer;
        padding: 5px 0px;
        padding-left: 5px;

        input[type="checkbox"], input[type="radio"] {
            cursor: pointer;
        }

        &:hover {
            background-color: var(--grey-medium-light);
        }
    }
}

.optionsList.reduce>li:nth-of-type(1n+8) {
    display: none;
}

.nameFilterContainer {
    display: inline-flex;
    width: 100%;
    justify-content: center;
    .nameFilter {
        margin: 10px;
    }
}
    
</style>
