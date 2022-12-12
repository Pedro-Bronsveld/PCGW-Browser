<script setup lang="ts">

const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>()

</script>

<template>
    <div class="menuButton"
        :class="{
            open
        }"
        @click="emit('click')" >
        <span></span>
        <span></span>
        <span></span>
    </div>
</template>

<style scoped lang="scss">
@use '../assets/screen';

.menuButton {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    @include screen.narrow {
        display: inline-flex;
    }

    width: 62px;
    height: 62px;
    background-color: var(--primary-8);
    margin-right: 15px;

    &.open {
        background-color: var(--grey-dark);
    }

    span {
        display: inline-block;
        width: 30px;
        height: 4px;
        background-color: white;
    }

    span + span {
        margin-top: 8px;
    }
}

</style>