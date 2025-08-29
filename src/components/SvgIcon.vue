<script setup>
  import { computed } from 'vue';
  const props = defineProps({
    name: String,
    color: {
      type: String,
      default: '#333'
    },
    size: {
      type: [Number, String],
      default: 1
    }
  });
  const emit = defineEmits(['click']);
  const symbolId = computed(() => {
    return '#icon-' + props.name;
  });
  const onClick = (e) => {
    emit('click', e);
  };
</script>
<script>
  export default {
    name: 'SvgIcon'
  };
</script>
<template>
  <svg
    aria-hidden="true"
    @click="onClick"
    :style="{
      width: props.size + 'em',
      height: props.size + 'em'
    }"
  >
    <use :href="symbolId" :fill="props.color" />
  </svg>
</template>
