import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();



//icacls "generated\prisma" /reset /T /C /Q
//Remove-Item -Path "generated\prisma" -Recurse -Force  

async function main() {
  //  Create Admins
    await prisma.admin.createMany({
        data: [
            { id: "admin1", username: "Admin1" },
            { id: "admin2", username: "Admin2" },
        ],
    });

    // Insert 100 Parents
    for (let i = 1; i <= 100; i++) {
        await prisma.parent.create({
            data: {
                id: `parent${i}`,
                username: `parentUser${i}`,
                surname: `Doe${i}`,
                email: `parent${i}@example.com`,
                phone: `123456789${i}`,
                address: `123 Main St, Apt ${i}`,
                img: `http://example.com/parent${i}.jpg`,
                bloodType: "A+",
                sex: i % 2 === 0 ? "FEMALE" : "MALE",
            },
        });
    }

    // Insert 100 Grades
    for (let i = 1; i <= 100; i++) {
        await prisma.grade.create({
            data: {
                id: i,
                level: i,
            },
        });
    }

    // Insert 100 Classes
    for (let i = 1; i <= 100; i++) {
        await prisma.class.create({
            data: {
                id: i,
                name: `Class${i}`,
                capacity: 30,
                gradeId: (i % 100) + 1, // Ensure gradeId is within the range of existing grades
            },
        });
    }

    // Insert 100 Subjects
    for (let i = 1; i <= 100; i++) {
        await prisma.subject.create({
            data: {
                id: i,
                name: `Subject${i}`,
            },
        });
    }

    // Insert 100 Teachers
    for (let i = 1; i <= 100; i++) {
        await prisma.teacher.create({
            data: {
                id: `teacher${i}`,
                username: `teacherUser${i}`,
                surname: `Doe${i}`,
                email: `teacher${i}@example.com`,
                phone: `098765432${i}`,
                address: `123 Main St, Apt ${i}`,
                img: `http://example.com/teacher${i}.jpg`,
                bloodType: "O+",
                sex: i % 2 === 0 ? "FEMALE" : "MALE",
                subjects: {
                    connect: [{ id: (i % 100) + 1 }],
                },
                classes: {
                    connect: [{ id: (i % 100) + 1 }],
                },
            },
        });
    }

    // Insert 100 Students
    for (let i = 1; i <= 100; i++) {
        await prisma.student.create({
            data: {
                id: `student${i}`,
                username: `studentUser${i}`,
                surname: `Doe${i}`,
                email: `student${i}@example.com`,
                phone: `123456789${i}`,
                address: `123 Main St, Apt ${i}`,
                img: `http://example.com/student${i}.jpg`,
                bloodType: "AB+",
                sex: i % 2 === 0 ? "FEMALE" : "MALE",
                parentId: `parent${i}`,
                classId: (i % 100) + 1,
                gradeId: (i % 100) + 1,
            },
        });
    }

    // Insert 100 Lessons
    for (let i = 1; i <= 100; i++) {
        const day = i % 5 === 0 ? "FRIDAY" : i % 4 === 0 ? "THURSDAY" : i % 3 === 0 ? "WEDNESDAY" : i % 2 === 0 ? "TUESDAY" : "MONDAY";
        const startTime = new Date(`2025-04-12T${String(i).padStart(2, '0')}:00:00Z`);
        const endTime = new Date(`2025-04-12T${String(i + 1).padStart(2, '0')}:00:00Z`);
        const subjectId = (i % 100) + 1;
        const classId = (i % 100) + 1;
        const teacherId = `teacher${i}`;

        try {
            await prisma.lesson.create({
                data: {
                    id: i,
                    name: `Lesson${i}`,
                    day: day,
                    startTime: startTime,
                    endTime: endTime,
                    subjectId: subjectId,
                    classId: classId,
                    teacherId: teacherId,
                },
            });
        } catch (error) {
            console.error(`Failed to create lesson ${i}:`, error);
        }
    }

    // Insert 100 Exams
    for (let i = 1; i <= 100; i++) {
        const lessonId = i; // Ensure this lessonId exists in the Lesson table
        const subjectId = (i % 100) + 1;
        const classId = (i % 100) + 1;
        const teacherId = `teacher${i}`;

        try {
            await prisma.exam.create({
                data: {

                    id: i,
                    title: `Exam${i}`,
                    startTime: new Date(`2025-04-12T0${i}:00:00`),
                    endTime: new Date(`2025-04-12T0${i + 1}:00:00`),
                    lessionId: (i % 100) + 1,
                },
            });
        } catch (error) {
            console.error(`Failed to create exam ${i}:`, error);
        }
    }


    // Insert 100 Assignments
    for (let i = 1; i <= 100; i++) {
        await prisma.assignment.create({
            data: {
                id: i,
                title: `Assignment${i}`,
                startDate: new Date(`2025-04-12T0${i}:00:00`),
                dueDate: new Date(`2025-04-19T0${i}:00:00`),
                lessionId: (i % 100) + 1,
            },
        });
    }

    // Insert 100 Results
    for (let i = 1; i <= 100; i++) {
        await prisma.result.create({
            data: {
                id: i,
                score: i * 10,
                examId: (i % 100) + 1,
                assignmentId: (i % 100) + 1,
                studentId: `student${i}`,
            },
        });
    }

    // Insert 100 Attendance Records
    for (let i = 1; i <= 100; i++) {
        await prisma.attendance.create({
            data: {
                id: i,
                date: new Date(`2025-04-12T0${i}:00:00`),
                present: i % 2 === 0,
                studentId: `student${i}`,
                lessionId: (i % 100) + 1,
            },
        });
    }

    // Insert 100 Events
    for (let i = 1; i <= 100; i++) {
        await prisma.event.create({
            data: {
                id: i,
                title: `Event${i}`,
                description: `Description for Event${i}`,
                startTime: new Date(`2025-04-12T0${i}:00:00`),
                endTime: new Date(`2025-04-12T0${i + 1}:00:00`),
                classId: (i % 100) + 1,
            },
        });
    }

    // Insert 100 Announcements
    for (let i = 1; i <= 100; i++) {
        await prisma.annoucement.create({
            data: {
                id: i,
                title: `Announcement${i}`,
                description: `Description for Announcement${i}`,
                date: new Date(`2025-04-12T0${i}:00:00`),
                classId: (i % 100) + 1,
            },
        });
    }

    console.log("Data insertion completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
