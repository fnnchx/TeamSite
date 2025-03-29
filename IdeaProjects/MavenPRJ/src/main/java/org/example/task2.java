package org.example;

public class task2 {
    public static void main(String[] args) {
        Tester tester = Tester.createTester("Ivan", "Ivanov", 5, "B2", 60000);
        tester.displayInfo();
        tester.displayInfo(tester.experienceInYears);
        tester.displayInfo(tester.salary);
    }
}