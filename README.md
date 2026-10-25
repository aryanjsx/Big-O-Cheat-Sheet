# Big O Cheat Sheet

A compact, browser-friendly reference for comparing the time and space complexities of common data structures, sorting algorithms, and the graph and tree algorithms that come up in DSA interviews.

## What's included

- **Search and filters:** search by name or keyword, then filter by topic, complexity class, or interview relevance.
- **Explanation cards:** for 34 topics, a card with when to use it, why it costs what it does, a short Python example, common pitfalls, and a reference link.
- **Big O playground:** change the input size n and watch O(1), O(log n), O(n), O(n log n), O(n²), and O(2ⁿ) pull apart. Switch to a logarithmic axis, hide curves, widen the chart range, and see how long each class would take at 10⁸ operations per second. Each class has a short Python example.
- **Common data structure operations:** average- and worst-case time for access, search, insertion, and deletion, plus worst-case space complexity.
- **More data structures:** dynamic arrays, binary heaps, tries, disjoint-set union (Union-Find), monotonic stacks, deques, and a comparison of priority queue implementations.
- **Graph representations:** adjacency list, adjacency matrix, and edge list compared on space, edge lookup, neighbor iteration, and edge updates, with one example graph shown all three ways.
- **Array sorting algorithms:** best-, average-, and worst-case time complexity, plus worst-case space complexity.
- **Algorithm complexity:** a quick reference for linear search, binary search, BFS, DFS, heap operations, merge intervals, Union-Find, and Dijkstra.
- **Graph and tree algorithms:** BFS, DFS, binary search, tree traversals, heap operations, shortest-path algorithms, and minimum spanning trees.
- **Coding patterns:** typical time and auxiliary space for two pointers, sliding window, prefix sums, hash map counting, monotonic stacks, backtracking, permutations, and dynamic programming, with a note that these are typical costs, not guarantees.
- **Precise notation:** the data structure and sorting tables separate average, amortized, and worst case, state their assumptions, and explain implementation differences, such as array-backed queues and unbalanced binary search trees.
- **Print and PDF:** a print stylesheet, `Big-O-Sheet.pdf` (full sheet), and `Big-O-Sheet-one-page.pdf` (interview revision sheet). The one-page view is also available in the page by selecting **One-page revision view**, or by opening `index.html#revision`.
- Links to further reading for the listed structures and algorithms.

### Practice and study tools

- **Algorithm visualizer:** step through linear search, binary search, bubble sort, merge sort, BFS, and DFS with comparison, swap, and write counters. Play, pause, step forward, and step back.
- **Big O quiz:** ten random multiple-choice questions from a bank of 23, with an explanation after every answer, a final score, and a review of what you missed.
- **Code complexity challenges:** predict the time and auxiliary space of short Python, JavaScript, and Java snippets before you reveal the answer.
- **Compare two algorithms:** side-by-side time, space, stability, best uses, and trade-offs for 18 topics, such as merge sort vs. quicksort or BFS vs. DFS. Copy the table as Markdown or share a link.
- **DSA interview roadmap:** all 34 topics in a suggested order across Beginner, Intermediate, and Advanced levels, with prerequisites for each step.
- **Complexity lookup:** search an operation and see best, average, and worst case together, with the assumption behind the average case and the implementation caveat.
- **Multilanguage examples:** Java, C++, and JavaScript versions next to the Python snippet on seven cards, with a note on what the language changes about the cost.
- **Bookmarks and progress:** save topics, mark them as learned, filter by progress, and resume where you left off. Everything is stored in your browser's local storage. No account or backend is involved.
- **Export and share:** copy a Markdown table, download a CSV (the topics or the lookup table), print compact topic cards, and copy a link that opens a specific topic (`#algo=bfs`) or comparison (`#compare=mergesort,quicksort`).
- **Accessibility:** keyboard shortcuts (press `?` to list them), visible focus states, a skip link, text descriptions for the chart and the visualizer, and support for the reduced-motion setting. The visualizer never starts moving on its own.

## View the cheat sheet

Visit [BIGOSHEET](https://aryanjsx.github.io/Big-O-Sheet/) or open `index.html` in a web browser. The project is a single static HTML page and does not require installation, a build step, or a development server. It works offline and follows your system's light or dark setting.

## Reading the notation

- `O(...)` describes an asymptotic upper bound.
- `Ω(...)` describes an asymptotic lower bound.
- `Θ(...)` describes a tight asymptotic bound.
- `n` represents the input size. Graph algorithms use `V` for vertices and `E` for edges. Some algorithms use additional parameters, such as `k` or `m`, as noted in the table.
- `α(n)` is the inverse Ackermann function, which is at most 4 for any practical input.
- Average (expected) cost depends on a stated assumption, such as random input or a well-behaved hash function. Amortized cost averages over a worst-case sequence of operations. Worst-case cost is the most a single operation can take.
- `N/A` indicates that the operation is not applicable in the table's context.

Complexities are quick-reference summaries; actual performance can depend on the implementation, input characteristics, and assumptions behind each operation. Consult the linked references when exact guarantees matter.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the accuracy rules, project layout, and a pull request checklist.
