export type Difficulty = "easy" | "medium" | "hard";

export type LessonExample = {
  title: string;
  python: string;
  java: string;
  explanation: string;
};

export type PracticeQuestion = {
  id: string;
  title: string;
  difficulty: Difficulty;
  prompt: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  solution: string;
};

export type InteractiveLesson = {
  conceptKey: string;

  learningObjectives: string[];

  examples: LessonExample[];

  commonMistakes: {
    mistake: string;
    explanation: string;
  }[];

  underTheHood: {
    title: string;
    explanation: string;
  }[];

  practice: PracticeQuestion[];
};

export const interactiveLessons: Record<
  string,
  InteractiveLesson
> = {
  "java-arraylist": {
    conceptKey: "java-arraylist",

    learningObjectives: [
      "Understand why ArrayList is the closest Java equivalent to a Python list.",
      "Translate common Python list operations into Java ArrayList operations.",
      "Understand Java generics and why ArrayList<Integer> uses Integer instead of int.",
      "Understand how ArrayList grows internally when it runs out of capacity.",
      "Recognize when to use an ArrayList instead of a fixed-size Java array.",
    ],

    examples: [
      {
        title: "Creating a collection",

        python: `numbers = [10, 20, 30]`,

        java: `ArrayList<Integer> numbers = new ArrayList<>();

numbers.add(10);
numbers.add(20);
numbers.add(30);`,

        explanation:
          "Python can create a list directly with a literal. Java ArrayList requires creating the collection object and specifying the element type with a generic such as Integer.",
      },

      {
        title: "Adding an element",

        python: `numbers.append(40)`,

        java: `numbers.add(40);`,

        explanation:
          "Python uses append() to add an element to the end of a list. Java ArrayList uses add().",
      },

      {
        title: "Accessing an element",

        python: `first = numbers[0]`,

        java: `int first = numbers.get(0);`,

        explanation:
          "Both languages use zero-based indexing, but Java ArrayList does not use square-bracket indexing. The get() method retrieves an element at a particular index.",
      },

      {
        title: "Updating an element",

        python: `numbers[1] = 50`,

        java: `numbers.set(1, 50);`,

        explanation:
          "Python assigns directly through an index. ArrayList uses set(index, value) to replace the element stored at that position.",
      },

      {
        title: "Removing an element",

        python: `numbers.remove(20)`,

        java: `numbers.remove(Integer.valueOf(20));`,

        explanation:
          "Java has an important distinction here. ArrayList<Integer>.remove(int) treats the argument as an index, so Integer.valueOf(20) explicitly asks Java to remove the value 20.",
      },

      {
        title: "Finding the size",

        python: `size = len(numbers)`,

        java: `int size = numbers.size();`,

        explanation:
          "Python uses the built-in len() function. Java collections expose their size through the size() method.",
      },
    ],

    commonMistakes: [
      {
        mistake: "Using numbers[0] with an ArrayList",

        explanation:
          "Square-bracket indexing works with Java arrays, not ArrayList. Use numbers.get(0) to read an element and numbers.set(0, value) to replace one.",
      },

      {
        mistake: "Using int instead of Integer in ArrayList<Integer>",

        explanation:
          "Java generics work with reference types rather than primitive types. Therefore ArrayList uses Integer rather than int.",
      },

      {
        mistake: "Confusing size with size()",

        explanation:
          "A Java array uses numbers.length, while an ArrayList uses numbers.size(). ArrayList's size is a method because the collection can grow or shrink.",
      },

      {
        mistake: "Assuming ArrayList has a fixed length",

        explanation:
          "Unlike a Java array, ArrayList is dynamically sized. Elements can be added and removed after the collection is created.",
      },

      {
        mistake: "Forgetting the import",

        explanation:
          "ArrayList belongs to java.util, so a normal Java source file needs import java.util.ArrayList; before using the class.",
      },
    ],

    underTheHood: [
      {
        title: "ArrayList is backed by an array",

        explanation:
          "ArrayList does not store every element in a separate dynamically allocated structure. Internally, it maintains an array that stores references to the elements.",
      },

      {
        title: "Capacity is different from size",

        explanation:
          "Size is the number of elements currently stored. Capacity is how many elements the internal array can hold before it needs to grow. These two values are not necessarily equal.",
      },

      {
        title: "What happens when capacity is exhausted?",

        explanation:
          "When an ArrayList needs more room than its current internal array provides, it allocates a larger array and copies the existing elements into the new storage. This allows the collection to continue growing.",
      },

      {
        title: "Why add() is usually fast",

        explanation:
          "Adding an element at the end is normally an O(1) amortized operation. Most additions do not require resizing, although an occasional resize requires copying elements.",
      },

      {
        title: "Why inserting in the middle is slower",

        explanation:
          "When an element is inserted into the middle, existing elements after that position may need to be shifted to make room. This makes arbitrary middle insertion O(n).",
      },

      {
        title: "ArrayList and generics",

        explanation:
          "ArrayList<Integer> tells the compiler that the collection is intended to contain Integer objects. Java's generic type checking prevents incompatible values from being added.",
      },
    ],

    practice: [
      {
        id: "arraylist-easy-1",
        title: "Create and print an ArrayList",
        difficulty: "easy",

        prompt:
          "Create an ArrayList<Integer>, add 10, 20, and 30 to it, and print the list.",

        starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {

        // Create an ArrayList<Integer>


        // Add 10, 20, and 30


        // Print the list

    }
}`,

        expectedOutput: `[10, 20, 30]`,

        hints: [
          "You need an ArrayList that stores Integer values.",
          "Use add() three times.",
          "Print the ArrayList with System.out.println().",
        ],

        solution: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        System.out.println(numbers);
    }
}`,
      },

      {
        id: "arraylist-easy-2",
        title: "Add an element",
        difficulty: "easy",

        prompt:
          "The ArrayList already contains three numbers. Add 40 to the end and print the result.",

        starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        // Add 40


        System.out.println(numbers);
    }
}`,

        expectedOutput: `[10, 20, 30, 40]`,

        hints: [
          "Python uses append() for this operation.",
          "ArrayList uses add().",
          "Add 40 using numbers.add(40).",
        ],

        solution: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        numbers.add(40);

        System.out.println(numbers);
    }
}`,
      },

      {
        id: "arraylist-easy-3",
        title: "Access an element",
        difficulty: "easy",

        prompt:
          "Print the first element of the ArrayList.",

        starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(15);
        numbers.add(25);
        numbers.add(35);

        // Print the first element

    }
}`,

        expectedOutput: `15`,

        hints: [
          "The first element has index 0.",
          "ArrayList does not use square brackets.",
          "Use the get() method.",
        ],

        solution: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(15);
        numbers.add(25);
        numbers.add(35);

        System.out.println(numbers.get(0));
    }
}`,
      },

      {
        id: "arraylist-easy-4",
        title: "Update an element",
        difficulty: "easy",

        prompt:
          "Change the second element from 20 to 50 and print the ArrayList.",

        starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        // Change 20 to 50


        System.out.println(numbers);
    }
}`,

        expectedOutput: `[10, 50, 30]`,

        hints: [
          "The second element has index 1.",
          "ArrayList provides a method for replacing an element.",
          "Use set(index, value).",
        ],

        solution: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        numbers.set(1, 50);

        System.out.println(numbers);
    }
}`,
      },

      {
        id: "arraylist-medium-1",
        title: "Sum the elements",
        difficulty: "medium",

        prompt:
          "Calculate and print the sum of every number in the ArrayList.",

        starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(40);

        int sum = 0;

        // Calculate the sum


        System.out.println(sum);
    }
}`,

        expectedOutput: `100`,

        hints: [
          "You need to visit every element.",
          "Use a loop from index 0 up to numbers.size().",
          "Add numbers.get(i) to sum during every iteration.",
        ],

        solution: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(40);

        int sum = 0;

        for (int i = 0; i < numbers.size(); i++) {
            sum += numbers.get(i);
        }

        System.out.println(sum);
    }
}`,
      },

      {
        id: "arraylist-hard-1",
        title: "Remove all values below a threshold",
        difficulty: "hard",

        prompt:
          "Remove every number smaller than 20 from the ArrayList, then print the remaining values.",

        starterCode: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(5);
        numbers.add(25);
        numbers.add(10);
        numbers.add(30);
        numbers.add(15);
        numbers.add(40);

        int threshold = 20;

        // Remove every value smaller than threshold


        System.out.println(numbers);
    }
}`,

        expectedOutput: `[25, 30, 40]`,

        hints: [
          "You need to examine every value in the ArrayList.",
          "Be careful when removing elements while iterating because removing an element changes later indexes.",
          "One safe approach is to iterate from the end of the ArrayList toward the beginning.",
        ],

        solution: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(5);
        numbers.add(25);
        numbers.add(10);
        numbers.add(30);
        numbers.add(15);
        numbers.add(40);

        int threshold = 20;

        for (int i = numbers.size() - 1; i >= 0; i--) {
            if (numbers.get(i) < threshold) {
                numbers.remove(i);
            }
        }

        System.out.println(numbers);
    }
}`,
      },
    ],
  },
};