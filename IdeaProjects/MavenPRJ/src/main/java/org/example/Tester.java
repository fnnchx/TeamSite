package org.example;

    public class Tester {
        private String name;
        private String surname;
        int experienceInYears;
        private String englishLevel;
        double salary;

        public Tester() {
            this("Unknown", "Unknown", 0, "None", 0.0);
        }

        public Tester(String name) {
            this(name, "Unknown", 0, "None", 0.0);
        }

        public Tester(String name, String surname) {
            this(name, surname, 0, "None", 0.0);
        }

        public Tester(String name, String surname, int experienceInYears, String englishLevel, double salary) {
            this.name = name;
            this.surname = surname;
            this.experienceInYears = experienceInYears;
            this.englishLevel = englishLevel;
            this.salary = salary;
        }

        public void displayInfo() {
            System.out.println("Name: " + name + ", Surname: " + surname);
        }

        public void displayInfo(int years) {
            System.out.println("Name: " + name + ", Surname: " + surname + ", Experience: " + years + " years");
        }

        public void displayInfo(double salary) {
            System.out.println("Name: " + name + ", Surname: " + surname + ", Salary: " + salary);
        }

        public static Tester createTester(String name, String surname, int experienceInYears, String englishLevel, double salary) {
            return new Tester(name, surname, experienceInYears, englishLevel, salary);
        }
    }

