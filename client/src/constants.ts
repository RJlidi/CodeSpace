import { LanguageVersions, CodeSnippets } from './types';

export const LANGUAGE_VERSIONS: LanguageVersions = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  cpp: "10.2.0",
};

export const CODE_SNIPPETS: CodeSnippets = {
  javascript: `console.log("Hello, World!");

function sayHello() {
  return "Hello, World!";
}

sayHello();`,

  typescript: `console.log("Hello, World!");

function greetUser(name: string): string {
  return \`Hello, \${name}!\`;
}

const message: string = greetUser("World");
console.log(message);`,

  python: `print("Hello, World!")

def say_hello(name="World"):
    return f"Hello, {name}!"

message = say_hello()
print(message)`,

  java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // This is a simple Java hello world example
        String message = greetUser("World");
        System.out.println(message);
    }
    
    public static String greetUser(String name) {
        return "Hello, " + name + "!";
    }
}`,

  csharp: `using System;

public class HelloWorld
{
    public static void Main()
    {
        Console.WriteLine("Hello, World!");
        
        string message = GreetUser("World");
        Console.WriteLine(message);
    }
    
    public static string GreetUser(string name)
    {
        return $"Hello, {name}!";
    }
}`,

  php: `<?php
echo "Hello, World!";

function sayHello($name = "World") {
    return "Hello, " . $name . "!";
}

$message = sayHello();
echo $message;
?>`,

  cpp: `#include <iostream>
#include <string>

std::string sayHello(const std::string& name = "World") {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    std::string message = sayHello();
    std::cout << message << std::endl;
    
    return 0;
}`
};
