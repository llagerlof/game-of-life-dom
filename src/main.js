import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'Conway\'s Game of Life DOM'
  }
});

export default app;
