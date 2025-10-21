import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with sample data...");

  // 1️⃣ Create a sample user
  const user = await prisma.user.create({
    data: {
      name: "Razan Doughman",
      email: "razan@example.com",
      password: "hashedpassword123",
      goals: "Gain muscle & improve endurance",
      equipment: "Dumbbells, yoga mat",
      dietaryInfo: "High protein, low sugar diet",
    },
  });
  console.log("✅ Created user:", user);

  // 2️⃣ Create a sample exercise
  const exercise = await prisma.exercise.create({
    data: {
      name: "Bicep Curl",
      gifUrl: "https://example.com/bicep.gif",
      bodyPart: "arms",
      equipment: "dumbbell",
      target: "biceps",
      instructions: "Hold a dumbbell in each hand and curl upward.",
    },
  });
  console.log("✅ Created exercise:", exercise);

  // 3️⃣ Save the exercise as a favorite
  const saved = await prisma.savedExercise.create({
    data: {
      userId: user.id,
      exerciseId: exercise.id,
    },
  });
  console.log("✅ Saved exercise:", saved);

  // 4️⃣ Add a progress log
  const progress = await prisma.progressLog.create({
    data: {
      userId: user.id,
      weight: 58.5,
      chest: 86.0,
      waist: 65.0,
      hips: 92.0,
      photoUrl: "https://example.com/progress-photo.jpg",
    },
  });
  console.log("✅ Added progress log:", progress);
}

main()
  .catch((err) => console.error("❌ Error while seeding:", err))
  .finally(async () => await prisma.$disconnect());
