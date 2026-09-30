export type RoadmapConcept = {
  key: string;
  title: string;
  description: string;
  category: "syntax" | "data-structures" | "algorithms" | "oop";
  difficulty: "foundation" | "core" | "advanced";
  prerequisites: string[];
};

export const roadmapConcepts: RoadmapConcept[] = [
  {
    key: "java-types",
    title: "Variables & Types",
    description: "Python variables → Java static typing, primitives and references.",
    category: "syntax",
    difficulty: "foundation",
    prerequisites: [],
  },
  {
    key: "java-control-flow",
    title: "Control Flow",
    description: "if, switch, for, while and Java-specific syntax.",
    category: "syntax",
    difficulty: "foundation",
    prerequisites: ["java-types"],
  },
  {
    key: "java-methods",
    title: "Functions → Methods",
    description: "Parameters, return types, overloading and method syntax.",
    category: "syntax",
    difficulty: "core",
    prerequisites: ["java-control-flow"],
  },
  {
    key: "java-arrays",
    title: "Lists → Arrays",
    description: "Compare Python lists with Java's fixed-size arrays.",
    category: "data-structures",
    difficulty: "foundation",
    prerequisites: ["java-control-flow"],
  },
  {
    key: "java-arraylist",
    title: "Lists → ArrayList",
    description: "Dynamic collections, generics and resizing.",
    category: "data-structures",
    difficulty: "core",
    prerequisites: ["java-types", "java-control-flow"],
  },
  {
    key: "java-hashmap",
    title: "Dictionary → HashMap",
    description: "Key-value structures and Java's typed collections.",
    category: "data-structures",
    difficulty: "core",
    prerequisites: ["java-arraylist"],
  },
  {
    key: "java-hashset",
    title: "Set → HashSet",
    description: "Uniqueness, hashing and set operations.",
    category: "data-structures",
    difficulty: "core",
    prerequisites: ["java-arraylist"],
  },
  {
    key: "java-classes",
    title: "Classes & Objects",
    description: "Map Python classes to Java classes, constructors and objects.",
    category: "oop",
    difficulty: "core",
    prerequisites: ["java-methods"],
  },
  {
    key: "java-inheritance",
    title: "Inheritance",
    description: "Understand Java inheritance and how it differs from Python.",
    category: "oop",
    difficulty: "core",
    prerequisites: ["java-classes"],
  },
  {
    key: "java-interfaces",
    title: "Interfaces",
    description: "Java interfaces and their relationship to Python abstractions.",
    category: "oop",
    difficulty: "core",
    prerequisites: ["java-classes"],
  },
  {
    key: "java-generics",
    title: "Generics",
    description: "Why Java uses types like ArrayList<Integer> and HashMap<String, Integer>.",
    category: "oop",
    difficulty: "advanced",
    prerequisites: ["java-classes", "java-arraylist"],
  },
  {
    key: "java-sorting",
    title: "Sorting & Comparators",
    description: "Translate Python sorting patterns into Java Comparator logic.",
    category: "algorithms",
    difficulty: "core",
    prerequisites: ["java-arrays", "java-methods"],
  },
  {
    key: "java-binary-search",
    title: "Binary Search",
    description: "Implement and reason about binary search in Java.",
    category: "algorithms",
    difficulty: "core",
    prerequisites: ["java-arrays", "java-sorting"],
  },
  {
    key: "java-recursion",
    title: "Recursion",
    description: "Translate recursive Python solutions into Java.",
    category: "algorithms",
    difficulty: "core",
    prerequisites: ["java-methods"],
  },
];