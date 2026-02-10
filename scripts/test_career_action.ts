import { getCareerProgress } from "../src/actions/career";
import { prisma } from "../src/lib/prisma";

async function main() {
    const user = await prisma.user.findFirst({
        where: { email: "castrouxui@gmail.com" } // From screenshot
    });

    if (!user) {
        console.log("❌ User not found");
        return;
    }

    console.log(`🔍 Testing getCareerProgress for user: ${user.id} (${user.email})`);
    try {
        const result = await getCareerProgress(user.id, "career-trader-100");
        console.log("✅ Result:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
