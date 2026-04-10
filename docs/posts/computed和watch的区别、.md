---
title: computed和watch的区别
date: 2025-04-27
tags:
  - 前端面经
---
前端面试题之computed和watch的区别
---




在现代前端的面试中，vue和react是面试过程中基本必问的技术栈，其中在聊到Vue响应式话题时，`watch和computed`是面试官非常喜欢聊的主题，虽然`watch`和`computed`它们都用于监听数据的变化，但它们在实现原理、使用场景和行为上有着显著的区别。本文将深入探讨`watch`和`computed`的原理和区别，并提供一些面试过程中的建议。

## 先了解下Vue 3响应式

Vue 3使用了Proxy作为其底层响应式实现可以监听对象属性的变化并触发相应的更新。当你访问数据时，Vue会建立一个依赖关系，然后在数据发生变化时通知相关的依赖项，从而更新视图。在这个背景下，我们深入探讨`watch`和`computed`的底层源码和使用上的区别。

## Watch

`watch`选项允许你监听数据的变化并执行自定义的操作。它通常用于监视某个数据的变化并执行副作用，比如异步请求、打印日志或触发动画。当你创建一个`watch`属性时，Vue会建立一个响应式依赖关系，将该`watch`属性关联到你要监视的数据。当监视的数据发生变化时，Vue会通知相关的`watch`属性，触发其回调函数。这个回调函数会接收新值和旧值作为参数，你可以在其中执行所需的操作。

### 源码分析

相关文件：`vue/src/runtime-core/apiWatch.ts`和`vue/src/reactivity/src/effect.ts`。

在Vue 3的源码中，`watch`的实现主要依赖于`createWatcher`函数和`Watcher`类。

- `createWatcher`函数负责创建`Watcher`实例，并接收监视的数据、回调函数以及其他选项。
- `Watcher`类是`watch`的核心，它建立了对监视数据的依赖，并在数据变化时触发回调函数。
- 在`Watcher`的内部，依赖项追踪和回调触发是通过Vue的响应式系统实现的。当监视的数据发生变化时，Vue会检测到依赖关系，从而触发`Watcher`的回调。

#### 解读

1、在`vue/src/runtime-core/apiWatch.ts`中，`watch`函数负责创建`Watcher`实例，如下所示：

```php
export function watch(
  source: WatchSource,
  cb: WatchCallback,
  options?: WatchOptions
): WatchStopHandle {
  // 创建一个watcher实例
  const watcher = new Watcher(vm, source, cb, {
    deep: options && options.deep,
    flush: options && options.flush,
    onTrack: options && options.onTrack,
    onTrigger: options && options.onTrigger,
  });
  // ...
}
```

这段代码创建了一个`Watcher`实例，其中`vm`是Vue实例，`source`是要监视的数据，`cb`是回调函数，以及其他选项。

2、Watcher`的核心工作在`vue/src/reactivity/src/effect.ts\`中，其中包含了依赖项追踪和回调触发的逻辑。下面是一个简化的示例：

```kotlin
class Watcher {
  // ...

  get() {
    // 设置当前的watcher为活动watcher
    pushTarget(this);
    // 执行监视的数据，触发依赖项的收集
    const value = this.getter.call(this.vm, this.vm);
    // 恢复之前的watcher
    popTarget();
    return value;
  }

  update() {
    // 触发回调函数，通知数据变化
    this.run();
  }

  run() {
    // 执行回调函数
    const value = this.get();
    if (value !== this.value || isObject(value) || this.deep) {
      // 触发回调函数
      this.cb(value, this.value);
      this.value = value;
    }
  }

  // ...
}
```

这段代码展示了`Watcher`的关键部分，包括`get`方法用于获取数据和触发依赖项追踪，以及`update`和`run`方法用于触发回调函数。

### watch使用

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled Count: {{ doubledCount }}</p>
    <button > Increment Count</button>
  </div>
</template>

<script setup>

import { ref, watch } from 'vue';

const count = ref(0);
const doubledCount = ref(0);

const incrementCount = () => {
  count.value++;
};

watch(count, (newVal, oldVal) => {
  // 监听 count 的变化
  doubledCount.value = newVal * 2;
});
</script>

```

在这个示例中，我们使用 `<script setup>` 来导入 `ref` 和 `watch`，并创建了 `count` 和 `doubledCount` 的响应式变量。然后，我们使用 `watch` 来监听 `count` 的变化，并在 `count` 变化时更新 `doubledCount` 的值。

## Computed

`computed`的工作原理与`watch` 有一些差异。`computed`允许派生出一个新的计算属性，它依赖于其他响应式数据。当你定义一个`computed`属性时，Vue会建立一个依赖关系，将该计算属性关联到其依赖项。计算属性的值仅在其依赖项发生变化时重新计算，并且在多次访问时会返回缓存的结果。这可以减少不必要的计算，提高性能。

### 源码分析

在Vue 3的源码中，`computed`的实现主要依赖于`createComputed`函数和`ComputedRefImpl`类。相关部分位于`vue/src/reactivity/src/computed.ts`文件中。

- `createComputed`函数负责创建`ComputedRefImpl`实例，接收计算函数和其他选项。
- `ComputedRefImpl`类是`computed`的核心，它包装了计算函数并实现了缓存机制。计算函数的执行和结果的缓存是通过Vue的响应式系统实现的。
- `ComputedRefImpl`实例在内部维护一个缓存，当依赖的数据变化时，它会重新计算并更新缓存。

#### 解读

1、在`vue/src/reactivity/src/computed.ts`中，`computed`函数负责创建`ComputedRefImpl`实例，如下所示：

```csharp
export function computed<T>(
  getter: ComputedGetter<T>,
  options?: ComputedOptions
): ComputedRef<T> {
  // 创建一个computed实例
  const c = new ComputedRefImpl(getter, options);
  // ...
  return c;
}
```

这段代码创建了一个`ComputedRefImpl`实例，其中`getter`是计算函数，`options`包含一些选项。

2、`ComputedRefImpl`的核心工作是负责追踪依赖项和缓存计算结果。下面是一个简化的示例：

```kotlin
class ComputedRefImpl<T> {
  // ...

  get value() {
    // 如果依赖项发生变化，或者值尚未计算
    if (this.dirty) {
      // 清除之前的依赖项
      cleanup(this);

      // 设置当前的computed属性为活动属性
      track(this);

      // 执行计算函数，获取新值
      this.value = this.effect();

      // 标记computed属性为已计算
      this.dirty = false;

      // 清理并设置新的依赖项
      stop(this);
    }

    // 返回缓存的值
    return this.value;
  }

  // ...
}
```

这段代码展示了`ComputedRefImpl`的核心工作流程：

1.  当首次访问`computed`属性或相关依赖项发生变化时，`computed`属性会被标记为"dirty"（未计算）。
2.  在获取属性值时，`value`的`getter`函数会被触发。
3.  在获取属性值时，Vue会清除先前的依赖项，然后重新追踪新的依赖项。
4.  计算函数(`effect`)会被执行，以获取新的值。
5.  新的值会被缓存，同时`dirty`标志会被设置为`false`，表示已计算。
6.  新的依赖项会被清理，并新的依赖项会被追踪。

这个缓存机制确保了`computed`属性的值只有在相关依赖项发生变化时才会重新计算，提高了性能并减少不必要的计算。

### Computed使用

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled Count: {{ doubledCount }}</p>
    <button @click="incrementCount">Increment Count</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);

const doubledCount = computed(() => {
  // 计算属性，依赖于 count
  return count.value * 2;
});

const incrementCount = () => {
  count.value++;
};
</script>
```

在这个示例中，我们同样使用 `<script setup>` 来导入 `ref` 和 `computed`，并创建了 `count` 和 `doubledCount` 的响应式变量。然后，我们使用 `computed` 来创建计算属性 `doubledCount`，该属性依赖于 `count` 的值。

## 区别与使用场景

上面我们介绍了二者之间的原理及使用方法，下面我们总结一下`watch`和`computed`之间的主要区别以及它们的使用场景。

### 区别

1.  **响应方式**：

    - `watch`用于监视数据的变化，它允许你执行副作用。
    - `computed`用于派生出一个新的计算属性，它的值会根据依赖项的变化而变化。

2.  **缓存**：

    - `watch`不会缓存结果，每次数据变化都会触发回调。
    - `computed`会缓存计算结果，只有在依赖项变化时才会重新计算。

### 使用场景

1.  **watch的使用场景**：

    - 异步操作：当你需要在数据变化时执行异步操作，如发送网络请求。
    - 副作用：执行一些与数据变化相关的操作，如日志记录或触发动画。
    - 监听多个数据的变化并执行不同的操作。

2.  **computed的使用场景**：

    - 派生属性：当你需要从现有数据派生出新的属性，以便在模板中使用。
    - 避免重复计算：当某个计算较为昂贵，但其依赖项不经常变化时，使用`computed`可以避免不必要的计算。

## 面试建议

面试官常常会问有关`watch`和`computed`的问题，以了解你对Vue的响应式系统的理解。下面给一些小建议希望能对你有帮助：

1.  **理解原理**：确保你理解`watch`和`computed`的工作原理以及它们与Vue的响应式系统的关系。
2.  **使用示例**：能够提供清晰的示例，说明如何使用`watch`和`computed`，以及何时使用它们。
3.  **区别与使用场景**：强调`watch`和`computed`之间的区别，以及何时选择其中之一的使用场景。
4.  **性能考虑**：在回答关于性能的问题时，能够解释`computed`如何帮助避免不必要的计算，并提高性能。
5.  **示范经验**：分享你在实际项目中使用`watch`和`computed`的经验和成功案例，这可以让面试官对你的实际技能有更好的了解。
