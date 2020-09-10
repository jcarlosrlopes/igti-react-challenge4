import axios from 'axios';

const API_URL = 'http://localhost:3001/grade';
const GRADE_VALIDATION = [
	{
		id: 1,
		gradeType: "Exercícios",
		minValue: 0,
		maxValue: 10
	},
	{
		id: 2,
		gradeType: "Trabalho Prático",
		minValue: 0,
		maxValue: 40
	},
	{
		id: 3,
		gradeType: "Desafio",
		minValue: 0,
		maxValue: 50
	}
];

async function getAllGrades() {
	const res = await axios.get(API_URL);

	const grades = res.data.grades.map(grade => {
		const { student, subject, type } = grade;

		return {
			...grade,
			studentLowerCase: student.toLowerCase(),
			subjectLowerCase: subject.toLowerCase(),
			typeLowerCase: type.toLowerCase(),
			isDeleted: false
		}
	});

	let allStudents = new Set();
	grades.forEach(grade => allStudents.add(grade.student));
	allStudents = Array.from(allStudents);

	let allSubjects = new Set();
	grades.forEach(grade => allSubjects.add(grade.subject));
	allSubjects = Array.from(allSubjects);

	let allGradeTypes = new Set();
	grades.forEach(grade => allGradeTypes.add(grade.type));
	allGradeTypes = Array.from(allGradeTypes);

	let maxId = -1;
	grades.forEach(({ id }) => {
		if (id > maxId) {
			maxId = id;
		}
	});

	const allCombinantions = [];
	allStudents.forEach(student => {
		allSubjects.forEach(subject => {
			allGradeTypes.forEach(type => {
				allCombinantions.push({
					student,
					subject,
					type
				});
			});
		});
	});

	allCombinantions.forEach(({ student, subject, type }) => {
		const hasItem = grades.find(grade => {
			return grade.student === student && grade.subject === subject && grade.type === type;
		});

		if (!hasItem) {
			grades.push({
				id: maxId++,
				student,
				studentLowerCase: student.toLowerCase(),
				subject,
				subjectLowerCase: subject.toLowerCase(),
				type,
				typeLowerCase: type.toLowerCase(),
				value: 0,
				isDeleted: true
			})
		}
	})

	grades.sort((a, b) => a.typeLowerCase.localeCompare(b.typeLowerCase));
	grades.sort((a, b) => a.subjectLowerCase.localeCompare(b.subjectLowerCase));
	grades.sort((a, b) => a.studentLowerCase.localeCompare(b.studentLowerCase));

	return grades;
}

async function insertGrade(grade) {
	const res = await axios.post(API_URL, grade);
	return res.data.id;
}

async function updateGrade(grade) {
	const res = await axios.put(API_URL, grade);
	return res.data;
}

async function deleteGrade(grade) {
	const res = await axios.delete(API_URL);
	return res.data;
}

function getValidationFromGradeType(gradeType) {
	const gradeValidation = GRADE_VALIDATION.find(item => item.gradeType === gradeType);
	const { minValue, maxValue } = gradeValidation;

	return {
		minValue,
		maxValue
	}
}

export { getAllGrades, insertGrade, updateGrade, deleteGrade, getValidationFromGradeType };