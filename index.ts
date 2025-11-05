type Student = {
  id: string;
  name: string;
  age: number;
};

// interface Student {
//   id: string;
//   name: string;
//   age: number;
// }

const students: Student[] = [];

const student : Student = {
  id: "1",
  name: "Temuulen",
  age: 27,
};

students.push(student);

students.push({
  id: "fds",
  name: "fdafa",
  age: 200,
});
