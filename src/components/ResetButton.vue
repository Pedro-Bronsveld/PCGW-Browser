<script setup lang="ts">

const props = defineProps<{
    value: string;
    title?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: "click"): void
}>();

</script>

<template>
        <input
            class="secondary resetButton"
            type="button"
            @click="emit('click')"
            :title="title"
            :value="value"
            :disabled="disabled" />
</template>
