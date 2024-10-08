<script setup lang="ts">
import { sortFilterOptions } from '@/browse/filter-options-util';
import type { BrowseFilters } from '@/constants/default-filters';
import { computed, ref, watch } from 'vue';
import { anyOptionsEnabled } from '@/browse/filter-options-util';
import { resetBrowseFilter } from '@/browse/browse-filters-reset';
import ResetButton from './ResetButton.vue';

const props = defineProps<{
    filter: BrowseFilters[keyof BrowseFilters]
}>();

const showAll = ref(false);
const nameMatch = ref("");
const picked = ref("");
const optionElements = new Map<number, HTMLInputElement | null>();
const anyEnabled = computed(() => anyOptionsEnabled(props.filter) || props.filter.and);

const optionsList = computed(() => {
    const optionsList = [...props.filter.options.values()]
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

const reset = () => {
    resetBrowseFilter(props.filter);
}

const toggleCollapse = () => props.filter.collapse = !props.filter.collapse;

</script>

<template>
    <h3 class="filterTitle"
    @click="toggleCollapse"
    :class="{
        collapse: filter.collapse,
        active: anyEnabled
    }" >{{ filter.title }}</h3>
    <div class="filterContent"
        :class="{
            collapse: filter.collapse
        }" >
        <div class="toggleContainer">
            <input v-if="filter.andCheckbox" 
                data-spacing="And" 
                :data-text="filter.and ? 'And' : 'Or'" 
                class="toggleCheckbox" 
                type="checkbox" 
                v-model="filter.and" 
            />
            <input v-if="props.filter.sortCheckbox" 
                data-spacing="Sort Alphabetical" 
                :data-text="filter.sortAlphabetical ? 'Sort Alphabetical' : 'Sort Default'"
                class="textToggle" 
                type="checkbox" 
                v-model="filter.sortAlphabetical" 
            />
            <ResetButton
                value="Reset"
                title="Reset filter"
                :disabled="!anyEnabled"
                @click="reset" />
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
                        <span class="optionValue">{{ option.value.replace(/_/g, " ") }}</span>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '../assets/screen.scss';

.filterTitle {
    margin: 13px 15px;
    cursor: pointer;

    &::before {
        content: '❯';
        display: inline-block;
        width: 25px;
        transform: rotate(90deg);
        text-align: center;
    }

    &.collapse {
        &::before {
            transform: rotate(0deg);
        }
    }

    &.active {
        &::after {
            content: "active";
            font-weight: normal;
            float: right;
            min-height: 25px;
            line-height: 25px;
            font-size: 13px;
            padding: 0 5px;
            color: white;
            background-color: var(--primary-7);
        }
    }
}

.filterContent {
    &.collapse {
        display: none;
    }
}

.toggleContainer {
    display: flex;
    justify-content: space-between;
    margin: 5px 15px;
}

.filterOptionsContainer {
    display: flex;
}

.showAll {
    position: relative;
    appearance: none;
    display: flex;
    width: 20px;
    margin: 0;

    @include screen.narrow {
        width: 40px;
    }
    
    &:enabled {
        background-color: var(--grey-medium-light);
        color: var(--grey-dark);
        cursor: pointer;
        display: flex;
        justify-content: center;

        &:hover {
            background-color: var(--primary-8);
            color: var(--primary-8-text);
        }

        &::after {
            content: "❯";
            position: relative;
            display: inline-flex;
            top: 100px;
            height: 20px;
            width: 20px;
            justify-content: center;
        }
    }

    &:checked {
        &::after {
            transform: rotate(90deg);
        }
    }
}

.optionsList {
    list-style: none;
    padding: 0;
    width: 100%;
    margin: 10px 0;

    .optionLabel {
        display: inline-flex;
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

        .optionValue {
            margin: 0 10px;
        }
    }
}

.optionsList.reduce>li:nth-of-type(1n+8) {
    display: none;
}

.nameFilterContainer {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
    .nameFilter {
        margin: 10px 15px;
    }
}
    
</style>
