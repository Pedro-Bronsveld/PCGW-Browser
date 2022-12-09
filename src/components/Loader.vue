<template>
    <div class="spinner"></div>
</template>

<style lang="scss">

@keyframes spin {
    from { transform: rotate(0deg); };
    to { transform: rotate(360deg); };
}

$size: 30px;

.spinner {
    display: inline-block;
    border: 10px solid var(--grey-medium-light);
    border-right-color: var(--primary-8);
    width: $size;
    height: $size;
    border-radius: 50%;
    animation: spin 1.5s linear infinite;;
}

</style>
