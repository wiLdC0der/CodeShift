export type RoadmapConcept = {
  key: string;
  title: string;
  description: string;
  category: "syntax" | "data-structures" | "algorithms" | "oop";
  difficulty: "foundation" | "core" | "advanced";
};

export const roadmapConcepts: RoadmapConcept[] = [
  {
    key: "java-types",
    title: "Variables & Types",
    description: "Python variables → Java static typing, primitives and references.",
    category: "syntax",
    difficulty: "foundation",
  },
  {
    key: "java-control-flow",
    title: "Control Flow",
    description: "if, switch, for, while and Java-specific syntax.",
    category: "syntax",
    difficulty: "foundation",
  },
  {
    key: "java-methods",
    title: "Functions → Methods",
    description: "Parameters, return types, overloading and method syntax.",
    category: "syntax",
    difficulty: "core",
  },
  {
    key: "java-arrays",
    title: "Lists → Arrays",
    description: "Compare Python lists with Java's fixed-size arrays.",
    category: "data-structures",
    difficulty: "foundation",
  },
  {
    key: "java-arraylist",
    title: "Lists → ArrayList",
    description: "Dynamic collections, generics and resizing.",
    category: "data-structures",
    difficulty: "core",
  },
  {
    key: "java-hashmap",
    title: "Dictionary → HashMap",
    description: "Key-value structures and Java's typed collections.",
    category: "data-structures",
    difficulty: "core",
  },
  {
    key: "java-hashset",
    title: "Set → HashSet",
    description: "Uniqueness, hashing and set operations.",
    category: "data-structures",
    difficulty: "core",
  },
  {
    key: "java-classes",
    title: "Classes & Objects",
    description: "Map Python classes to Java classes, constructors and objects.",
    category: "oop",
    difficulty: "core",
  },
  {
    key: "java-inheritance",
    title: "Inheritance",
    description: "Understand Java inheritance and how it differs from Python.",
    category: "oop",
    difficulty: "core",
  },
  {
    key: "java-interfaces",
    title: "Interfaces",
    description: "Java interfaces and their relationship to Python abstractions.",
    category: "oop",
    difficulty: "core",
  },
  {
    key: "java-generics",
    title: "Generics",
    description: "Why Java uses types like ArrayList<Integer> and HashMap<String, Integer>.",
    category: "oop",
    difficulty: "advanced",
  },
  {
    key: "java-sorting",
    title: "Sorting & Comparators",
    description: "Translate Python sorting patterns into Java Comparator logic.",
    category: "algorithms",
    difficulty: "core",
  },
  {
    key: "java-binary-search",
    title: "Binary Search",
    description: "Implement and reason about binary search in Java.",
    category: "algorithms",
    difficulty: "core",
  },
  {
    key: "java-recursion",
    title: "Recursion",
    description: "Translate recursive Python solutions into Java.",
    category: "algorithms",
    difficulty: "core",
  },
];