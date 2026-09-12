export type Lesson = {
  id: string;
  conceptKey: string;
  title: string;
  subtitle: string;
  category: string;

  python: {
    title: string;
    code: string;
    explanation: string;
  };

  java: {
    title: string;
    code: string;
    explanation: string;
  };

  keyDifferences: string[];

  underTheHood: {
    python: string;
    java: string;
  };

  exercise: {
    prompt: string;
    starterCode: string;
  };
};

export const lessons: Lesson[] = [
  {
    id: "types-to-types",
    conceptKey: "java-types",
    title: "Dynamic Types → Static Types",
    subtitle:
      "Understand what changes when moving from Python's dynamic typing to Java's static type system.",
    category: "Syntax",

    python: {
      title: "Python",
      code: `age = 21
name = "Altaf"
score = 95.5

print(age)
print(name)
print(score)`,
      explanation:
        "Python determines the type of a value at runtime. You can assign different types of values to variables without declaring a type explicitly.",
    },

    java: {
      title: "Java",
      code: `int age = 21;
String name = "Altaf";
double score = 95.5;

System.out.println(age);
System.out.println(name);
System.out.println(score);`,
      explanation:
        "Java requires variables to have a declared type. The compiler checks that values assigned to variables are compatible with those types.",
    },

    keyDifferences: [
      "Python variables do not require explicit type declarations.",
      "Java variables normally require an explicit type.",
      "Python performs much of its type checking at runtime.",
      "Java performs substantial type checking at compile time.",
      "Java has primitive types such as int and double alongside reference types such as String.",
    ],

    underTheHood: {
      python:
        "A Python variable refers to an object, and the object carries its runtime type information. The variable itself does not have a fixed declared type.",
      java:
        "Java's compiler uses declared types to check expressions and assignments before the program runs. At runtime, values are represented according to Java's primitive and reference type model.",
    },

    exercise: {
      prompt:
        "Convert the Python variables below into Java declarations using appropriate types.",
      starterCode: `# Python

age = 25
price = 99.99
name = "CodeShift"
is_active = True`,
    },
  },

  {
    id: "control-flow-to-control-flow",
    conceptKey: "java-control-flow",
    title: "Control Flow: Python → Java",
    subtitle:
      "See how conditions and loops change when moving from Python to Java.",
    category: "Syntax",

    python: {
      title: "Python",
      code: `age = 20

if age >= 18:
    print("Adult")
else:
    print("Minor")

for i in range(5):
    print(i)`,
      explanation:
        "Python uses indentation to define blocks. The range function is commonly used when iterating over a sequence of numbers.",
    },

    java: {
      title: "Java",
      code: `int age = 20;

if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}

for (int i = 0; i < 5; i++) {
    System.out.println(i);
}`,
      explanation:
        "Java uses braces to define blocks and requires explicit syntax around conditions. A traditional for loop usually contains initialization, a condition, and an update expression.",
    },

    keyDifferences: [
      "Python uses indentation to define blocks; Java uses braces.",
      "Java conditions are written inside parentheses.",
      "Python's range(...) is commonly replaced by an indexed Java for loop.",
      "Java statements normally end with semicolons.",
      "Java provides both traditional for loops and enhanced for-each loops.",
    ],

    underTheHood: {
      python:
        "Python parses indentation into the program's block structure. The loop iterates over the values produced by range.",
      java:
        "The Java compiler parses braces and loop expressions into bytecode that the JVM executes. The traditional for loop explicitly controls initialization, condition checking, and iteration updates.",
    },

    exercise: {
      prompt:
        "Convert the following Python loop into Java.",
      starterCode: `# Python

for i in range(1, 6):
    print(i)`,
    },
  },

  {
    id: "functions-to-methods",
    conceptKey: "java-methods",
    title: "Functions → Methods",
    subtitle:
      "Understand how Python functions map to Java methods, including parameters and return types.",
    category: "Syntax",

    python: {
      title: "Python function",
      code: `def add(a, b):
    return a + b

result = add(10, 20)
print(result)`,
      explanation:
        "Python functions are defined with def. Parameters do not require explicit types, and the function can return a value without declaring its return type.",
    },

    java: {
      title: "Java method",
      code: `static int add(int a, int b) {
    return a + b;
}

int result = add(10, 20);
System.out.println(result);`,
      explanation:
        "Java methods normally declare their return type and the type of every parameter. The static keyword allows this method to be called without creating an object.",
    },

    keyDifferences: [
      "Python uses def to define a function; Java uses a method declaration.",
      "Java requires parameter types such as int.",
      "Java requires the return type to be declared.",
      "Python can return objects of different types from different executions; Java's declared return type is checked by the compiler.",
      "Methods in Java can belong to classes, while Python functions can exist at module level.",
    ],

    underTheHood: {
      python:
        "When Python calls a function, it creates a new function execution frame containing the parameters and local variables. Python determines the types of supplied objects at runtime.",
      java:
        "Java compiles the method into JVM bytecode. The compiler verifies parameter and return types, and a method invocation creates a stack frame containing its parameters and local variables.",
    },

    exercise: {
      prompt:
        "Convert the following Python function into a Java method with the correct parameter and return types.",
      starterCode: `# Python

def multiply(a, b):
    return a * b

print(multiply(5, 4))`,
    },
  },
  {
  id: "set-to-hashset",
  conceptKey: "java-hashset",
  title: "Set → HashSet",
  subtitle:
    "Understand how Python sets map to Java's HashSet and how both prevent duplicate values.",
  category: "Data Structures",

  python: {
    title: "Python set",
    code: `numbers = {10, 20, 30, 20}

print(numbers)

numbers.add(40)

print(20 in numbers)`,
    explanation:
      "A Python set stores unique values. Duplicate values are automatically removed, and membership checks can be performed using the in operator.",
  },

  java: {
    title: "Java HashSet",
    code: `import java.util.HashSet;

HashSet<Integer> numbers = new HashSet<>();

numbers.add(10);
numbers.add(20);
numbers.add(30);
numbers.add(20);

System.out.println(numbers);

numbers.add(40);

System.out.println(numbers.contains(20));`,
    explanation:
      "HashSet stores unique values and uses hashing for efficient membership operations. Java requires the element type to be specified with generics.",
  },

  keyDifferences: [
    "Python uses set; Java commonly uses HashSet.",
    "Python uses add(x) to insert a value; HashSet also uses add(x).",
    "Python uses x in set for membership; Java uses set.contains(x).",
    "Both structures automatically prevent duplicate values.",
    "HashSet uses Java generics such as HashSet<Integer> to define the element type.",
  ],

  underTheHood: {
    python:
      "A Python set is implemented using a hash table. Each value is hashed to determine where it should be stored, allowing efficient membership checks.",
    java:
      "HashSet is backed by a hash-table-based implementation. It uses hashCode() and equals() to determine whether a value is already present.",
  },

  exercise: {
    prompt:
      "Convert the following Python set operations into Java using HashSet.",
    starterCode: `# Python

numbers = {5, 10, 15, 10}

numbers.add(20)

print(15 in numbers)
print(numbers)`,
  },
},
{
  id: "classes-to-objects",
  conceptKey: "java-classes",
  title: "Classes & Objects: Python → Java",
  subtitle:
    "Understand how Python classes map to Java classes, constructors, fields, methods, and objects.",
  category: "OOP",

  python: {
    title: "Python class",
    code: `class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"My name is {self.name}")

student = Student("Altaf", 22)

student.introduce()`,
    explanation:
      "Python classes define the structure and behavior of objects. The __init__ method initializes instance attributes, and self refers to the current object.",
  },

  java: {
    title: "Java class",
    code: `class Student {
    String name;
    int age;

    Student(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void introduce() {
        System.out.println("My name is " + name);
    }
}

Student student = new Student("Altaf", 22);

student.introduce();`,
    explanation:
      "Java classes define fields, constructors, and methods. The constructor initializes the object's state, and new creates an instance of the class.",
  },

  keyDifferences: [
    "Python defines a class using class and initializes objects through __init__; Java uses constructors with the class name.",
    "Python uses self to refer to the current object; Java uses this.",
    "Java requires field types such as String and int.",
    "Java creates objects explicitly with the new keyword.",
    "Java methods and fields belong to classes, and access can be controlled with modifiers such as public, private, and protected.",
  ],

  underTheHood: {
    python:
      "Creating a Python object allocates an instance whose attributes can be stored dynamically. When a method is called, the instance is passed as the first argument through self.",
    java:
      "Java objects are instances of classes managed by the JVM. The new expression creates an object, initializes its fields through the constructor, and returns a reference to that object.",
  },

  exercise: {
    prompt:
      "Convert the following Python class into a Java class with fields, a constructor, and a method.",
    starterCode: `# Python

class Car:
    def __init__(self, brand, year):
        self.brand = brand
        self.year = year

    def show_info(self):
        print(self.brand, self.year)

car = Car("Toyota", 2024)
car.show_info()`,
  },
},
{
  id: "inheritance-python-to-java",
  conceptKey: "java-inheritance",
  title: "Inheritance: Python → Java",
  subtitle:
    "Understand how inheritance works in both languages and what changes in Java's class-based model.",
  category: "OOP",

  python: {
    title: "Python inheritance",
    code: `class Animal:
    def speak(self):
        print("Animal sound")


class Dog(Animal):
    def speak(self):
        print("Woof")


dog = Dog()
dog.speak()`,
    explanation:
      "Python allows a class to inherit from another class by putting the parent class inside parentheses. A child class can reuse or override inherited methods.",
  },

  java: {
    title: "Java inheritance",
    code: `class Animal {
    void speak() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("Woof");
    }
}

Dog dog = new Dog();
dog.speak();`,
    explanation:
      "Java uses the extends keyword to inherit from a class. A subclass inherits accessible members of its parent and can override methods to provide specialized behavior.",
  },

  keyDifferences: [
    "Python specifies a parent class using parentheses; Java uses the extends keyword.",
    "Java classes have explicit access modifiers and a more structured class model.",
    "Python methods can be overridden without a required annotation; Java commonly uses @Override to make the intent explicit.",
    "Java supports single class inheritance, so a class can directly extend one class.",
    "Both languages support method overriding, but Java resolves many inheritance relationships through its compile-time type system.",
  ],

  underTheHood: {
    python:
      "When Python looks up an attribute or method on an object, it searches the object's class and then follows the method resolution order through its base classes.",
    java:
      "Java class inheritance forms a superclass/subclass hierarchy. The JVM uses the object's runtime class and inherited method metadata when resolving overridden method calls.",
  },

  exercise: {
    prompt:
      "Convert the following Python inheritance example into Java using extends and method overriding.",
    starterCode: `# Python

class Vehicle:
    def move(self):
        print("Vehicle is moving")


class Car(Vehicle):
    def move(self):
        print("Car is driving")


car = Car()
car.move()`,
  },
},
{
  id: "interfaces-python-to-java",
  conceptKey: "java-interfaces",
  title: "Protocols → Interfaces",
  subtitle:
    "Understand how Python's protocol-based approach compares with Java interfaces and explicit contracts.",
  category: "OOP",

  python: {
    title: "Python protocol-style behavior",
    code: `class Dog:
    def speak(self):
        print("Woof")


class Cat:
    def speak(self):
        print("Meow")


def make_sound(animal):
    animal.speak()


make_sound(Dog())
make_sound(Cat())`,
    explanation:
      "Python can rely on an object's behavior without requiring it to inherit from a particular base type. If the object provides the expected method, the code can use it.",
  },

  java: {
    title: "Java interface",
    code: `interface Animal {
    void speak();
}

class Dog implements Animal {
    @Override
    public void speak() {
        System.out.println("Woof");
    }
}

class Cat implements Animal {
    @Override
    public void speak() {
        System.out.println("Meow");
    }
}

static void makeSound(Animal animal) {
    animal.speak();
}

makeSound(new Dog());
makeSound(new Cat());`,
    explanation:
      "A Java interface defines a contract that implementing classes must satisfy. Classes use implements to promise that they provide the interface's required behavior.",
  },

  keyDifferences: [
    "Python can use duck typing, where an object is usable when it provides the required behavior.",
    "Java uses interfaces to explicitly define contracts between types.",
    "A Java class implements an interface using the implements keyword.",
    "Interface methods define behavior that implementing classes must provide.",
    "Java code can use an interface type to work with many different implementations.",
  ],

  underTheHood: {
    python:
      "Python's dynamic dispatch allows the runtime to look up speak on the actual object. No explicit interface declaration is required for an object to be used by make_sound.",
    java:
      "The Java compiler verifies that implementing classes satisfy the interface contract. At runtime, interface method dispatch selects the appropriate implementation for the actual object.",
  },

  exercise: {
    prompt:
      "Convert the following Python protocol-style example into Java using an interface.",
    starterCode: `# Python

class Printable:
    def print_data(self):
        print("Data")


def show(item):
    item.print_data()


show(Printable())`,
  },
},
{
  id: "generics-python-to-java",
  conceptKey: "java-generics",
  title: "Generics: Python → Java",
  subtitle:
    "Understand why Java collections use type parameters and how generics provide compile-time type safety.",
  category: "OOP",

  python: {
    title: "Python",
    code: `numbers = [10, 20, 30]

numbers.append(40)
numbers.append("hello")

print(numbers)`,
    explanation:
      "Python collections can hold values of different types. Python's dynamic type system does not require a list to declare the type of its elements.",
  },

  java: {
    title: "Java",
    code: `import java.util.ArrayList;

ArrayList<Integer> numbers = new ArrayList<>();

numbers.add(10);
numbers.add(20);
numbers.add(30);
numbers.add(40);

// numbers.add("hello"); // compile-time error

System.out.println(numbers);`,
    explanation:
      "Java generics allow a collection to declare the type of values it is intended to contain. ArrayList<Integer> means this collection is designed to hold Integer values.",
  },

  keyDifferences: [
    "Python collections do not normally require an element type declaration.",
    "Java collections commonly use generics such as ArrayList<Integer>.",
    "Generics allow the Java compiler to detect incompatible values before the program runs.",
    "Java generic type parameters use reference types, which is why collections use Integer rather than primitive int.",
    "Generics reduce the need for unsafe casts when retrieving values from collections.",
  ],

  underTheHood: {
    python:
      "Python keeps runtime type information with objects, and a list can reference objects of different types. Type checking, when used, is generally performed at runtime.",
    java:
      "Java generics provide compile-time type checking. Generic type information is primarily a compile-time feature, and Java's implementation uses type erasure for most generic types at runtime.",
  },

  exercise: {
    prompt:
      "Create a Java ArrayList that stores only String values and add three names to it.",
    starterCode: `// Your Java code

// Create an ArrayList<String>

// Add three names

// Print the list`,
  },
},
{
  id: "sorting-python-to-java",
  conceptKey: "java-sorting",
  title: "Sorting: Python → Java",
  subtitle:
    "Understand how built-in sorting compares across Python and Java, and what is happening underneath.",
  category: "Algorithms",

  python: {
    title: "Python sorting",
    code: `numbers = [5, 2, 8, 1, 3]

numbers.sort()

print(numbers)

sorted_numbers = sorted(numbers, reverse=True)

print(sorted_numbers)`,
    explanation:
      "Python provides sort() to modify a list in place and sorted() to create a new sorted result. Both support ascending or descending ordering.",
  },

  java: {
    title: "Java sorting",
    code: `import java.util.Arrays;

int[] numbers = {5, 2, 8, 1, 3};

Arrays.sort(numbers);

System.out.println(Arrays.toString(numbers));`,
    explanation:
      "Java provides library sorting methods such as Arrays.sort() for arrays. The sorting method depends on the collection or data structure being sorted.",
  },

  keyDifferences: [
    "Python list.sort() sorts the existing list in place, while sorted() returns a new sorted result.",
    "Java commonly uses utility methods such as Arrays.sort() for arrays.",
    "Python's sorting APIs are directly available on lists and through the built-in sorted function.",
    "Java separates sorting utilities based on the data structure being used.",
    "Both languages provide highly optimized library sorting implementations, so you usually should not implement sorting from scratch unless you are learning the algorithm itself.",
  ],

  underTheHood: {
    python:
      "Python's sorting implementation is based on Timsort, which combines ideas from merge sort and insertion sort and is designed to perform well on partially ordered data.",
    java:
      "Java uses different sorting implementations depending on the data type and API. Primitive arrays and object arrays can use different internal strategies optimized for their characteristics.",
  },

  exercise: {
    prompt:
      "Convert the following Python sorting code into Java. Sort the array in ascending order and print the result.",
    starterCode: `# Python

numbers = [9, 4, 7, 1, 6]

numbers.sort()

print(numbers)`,
  },
},
{
  id: "binary-search-python-to-java",
  conceptKey: "java-binary-search",
  title: "Binary Search: Python → Java",
  subtitle:
    "Understand the divide-and-conquer idea behind binary search and how its implementation changes in Java.",
  category: "Algorithms",

  python: {
    title: "Python",
    code: `def binary_search(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left <= right:
        mid = (left + right) // 2

        if numbers[mid] == target:
            return mid
        elif numbers[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1


numbers = [1, 3, 5, 7, 9, 11]

print(binary_search(numbers, 7))`,
    explanation:
      "Binary search works on a sorted sequence. Each step checks the middle element and eliminates half of the remaining search space.",
  },

  java: {
    title: "Java",
    code: `static int binarySearch(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (numbers[mid] == target) {
            return mid;
        } else if (numbers[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

int[] numbers = {1, 3, 5, 7, 9, 11};

System.out.println(binarySearch(numbers, 7));`,
    explanation:
      "Java uses an integer array and explicit types. The algorithm is the same: compare the target with the middle element and discard half of the search space after every comparison.",
  },

  keyDifferences: [
    "Both implementations require the input to be sorted.",
    "Python uses len(numbers); Java arrays use numbers.length.",
    "Python uses // for integer division; Java integer division with / produces an integer result when both operands are integers.",
    "Java commonly uses explicit int declarations for indexes and return values.",
    "The safe midpoint formula left + (right - left) / 2 avoids potential integer overflow in Java.",
  ],

  underTheHood: {
    python:
      "Each iteration reduces the remaining search interval by roughly half. After k iterations, the remaining search space is approximately n / 2^k, which gives binary search O(log n) time.",
    java:
      "Java executes the same logarithmic search strategy on the array. The explicit index arithmetic is checked and compiled into JVM bytecode, while the number of iterations remains O(log n).",
  },

  exercise: {
    prompt:
      "Implement binary search in Java for the sorted array below. Return the index of target, or -1 when the target is not present.",
    starterCode: `// Java

int[] numbers = {2, 4, 6, 8, 10, 12};
int target = 8;

// Write binary search here`,
  },
},

{
  id: "recursion-python-to-java",
  conceptKey: "java-recursion",
  title: "Recursion: Python → Java",
  subtitle:
    "Understand base cases, recursive calls, and how recursive execution works in Python and Java.",
  category: "Algorithms",

  python: {
    title: "Python recursion",
    code: `def factorial(n):
    if n == 0:
        return 1

    return n * factorial(n - 1)


print(factorial(5))`,
    explanation:
      "A recursive function calls itself with a smaller or simpler input. The base case stops the recursion, while the recursive case moves the problem toward that base case.",
  },

  java: {
    title: "Java recursion",
    code: `static int factorial(int n) {
    if (n == 0) {
        return 1;
    }

    return n * factorial(n - 1);
}

System.out.println(factorial(5));`,
    explanation:
      "Java recursion follows the same fundamental idea. The method calls itself with a smaller value until the base case is reached.",
  },

  keyDifferences: [
    "Python defines the recursive function with def; Java defines a typed method.",
    "Java requires the parameter and return types to be declared.",
    "Both languages need a base case to prevent infinite recursion.",
    "Each recursive call creates another execution frame containing its local state.",
    "Large recursive depths can exhaust the call stack in both languages.",
  ],

  underTheHood: {
    python:
      "Each recursive call creates a new Python function frame. For factorial(5), the calls continue until factorial(0) returns 1, after which the frames unwind and calculate the final result.",
    java:
      "Each recursive Java method invocation creates a new JVM stack frame. The frames remain active until the base case returns, after which the stack unwinds and each caller receives its result.",
  },

  exercise: {
    prompt:
      "Convert the following Python recursive function into Java. The function should return the sum of all integers from 1 through n.",
    starterCode: `# Python

def sum_to_n(n):
    if n == 0:
        return 0

    return n + sum_to_n(n - 1)

print(sum_to_n(5))`,
  },
},

{
  id: "list-to-array",
  conceptKey: "java-arrays",
  title: "Python List → Java Array",
  subtitle:
    "Understand the important difference between Python's dynamic lists and Java's fixed-size arrays.",
  category: "Data Structures",

  python: {
    title: "Python list",
    code: `numbers = [10, 20, 30]

numbers.append(40)

print(numbers)
print(numbers[0])`,
    explanation:
      "Python lists are dynamic collections. Their size can grow or shrink while the program is running, and elements can be accessed using zero-based indexing.",
  },

  java: {
    title: "Java array",
    code: `int[] numbers = {10, 20, 30};

System.out.println(numbers[0]);

// numbers[3] = 40; 
// The array has only 3 positions.`,
    explanation:
      "A Java array has a fixed length determined when the array is created. You can change the value stored at an existing index, but you cannot increase the array's length.",
  },

  keyDifferences: [
    "Python lists can grow and shrink dynamically; Java arrays have a fixed length.",
    "Python uses append() to add an element; a Java array has no append operation.",
    "Java arrays require an element type such as int[], String[], or double[].",
    "Both Python lists and Java arrays use zero-based indexing.",
    "When dynamic resizing is required in Java, ArrayList is usually used instead of a fixed-size array.",
  ],

  underTheHood: {
    python:
      "A Python list manages a dynamic internal array of object references. When the list needs more capacity, Python can allocate additional storage and resize the underlying structure.",
    java:
      "A Java array is an object with a fixed length. Its array storage is allocated with a specific number of elements, and that length does not change for the lifetime of the array.",
  },

  exercise: {
    prompt:
      "Convert the Python list below into a Java int array. The Java array should contain the same three values.",
    starterCode: `# Python

numbers = [10, 20, 30]

print(numbers[1])`,
  },
},

  {
  id: "dictionary-to-hashmap",
  conceptKey: "java-hashmap",
  title: "Dictionary → HashMap",
  subtitle:
    "Understand how Python dictionaries map to Java's HashMap and its key-value model.",
  category: "Data Structures",

  python: {
    title: "Python dictionary",
    code: `student = {
    "name": "Altaf",
    "age": 22,
    "score": 95
}

print(student["name"])

student["score"] = 98

print(student)`,
    explanation:
      "A Python dictionary stores key-value pairs. You can look up a value using its key, add new entries, or update an existing value.",
  },

  java: {
    title: "Java HashMap",
    code: `import java.util.HashMap;

HashMap<String, Integer> scores = new HashMap<>();

scores.put("Altaf", 95);
scores.put("Rahul", 88);

System.out.println(scores.get("Altaf"));

scores.put("Altaf", 98);

System.out.println(scores);`,
    explanation:
      "HashMap stores key-value pairs and uses hashing to efficiently locate values by key. Java requires you to specify the key and value types through generics.",
  },

  keyDifferences: [
    "Python uses dict; Java commonly uses HashMap for key-value storage.",
    "Python uses dictionary[key]; Java uses map.get(key) to retrieve a value.",
    "Python assigns with dictionary[key] = value; Java commonly uses map.put(key, value).",
    "Java HashMap uses generics such as HashMap<String, Integer> to specify key and value types.",
    "Python dictionaries and Java HashMaps both use hashing concepts, but their APIs and type systems are different.",
  ],

  underTheHood: {
    python:
      "A Python dictionary is implemented using a hash table. Python hashes a key and uses that information to locate the associated value efficiently.",
    java:
      "HashMap uses a hash table internally. The key's hash code determines where the entry is placed, and Java uses equality checks to distinguish keys that map to the same bucket.",
  },

  exercise: {
    prompt:
      "Convert the following Python dictionary into Java using HashMap.",
    starterCode: `# Python

prices = {
    "apple": 100,
    "banana": 40,
    "orange": 80
}

prices["banana"] = 50

print(prices["banana"])`,
  },
},

  {
    id: "lists-to-arraylist",
    conceptKey: "java-arraylist",
    title: "Lists → ArrayList",
    subtitle:
      "Understand how Python lists map to Java's dynamic collections.",
    category: "Data Structures",

    python: {
      title: "Python list",
      code: `numbers = [10, 20, 30]

numbers.append(40)

print(numbers)
print(numbers[0])`,
      explanation:
        "A Python list is a dynamic collection that can grow and shrink. You can append values and access elements using an index.",
    },

    java: {
      title: "Java ArrayList",
      code: `import java.util.ArrayList;

ArrayList<Integer> numbers = new ArrayList<>();

numbers.add(10);
numbers.add(20);
numbers.add(30);
numbers.add(40);

System.out.println(numbers);
System.out.println(numbers.get(0));`,
      explanation:
        "ArrayList is Java's dynamically sized collection backed by an internal array. Java also requires the element type to be specified.",
    },

    keyDifferences: [
      "Python uses list; Java commonly uses ArrayList for dynamic collections.",
      "Python list.append(x) corresponds roughly to ArrayList.add(x).",
      "Python indexing uses numbers[0]; Java uses numbers.get(0).",
      "Java collections use generics such as ArrayList<Integer>.",
      "Java primitive types such as int are different from reference types such as Integer.",
    ],

    underTheHood: {
      python:
        "A Python list stores references to Python objects and manages its dynamic capacity internally. When more capacity is needed, Python can resize the underlying storage.",
      java:
        "ArrayList stores elements in an internal array. When the array runs out of capacity, Java creates a larger array and copies the existing elements.",
    },

    exercise: {
      prompt:
        "Convert the following Python list code into Java using ArrayList.",
      starterCode: `# Python

numbers = [5, 10, 15]
numbers.append(20)

print(numbers)`,
    },
  },
];

export function getLessonById(id: string) {
  return lessons.find((lesson) => lesson.id === id);
}