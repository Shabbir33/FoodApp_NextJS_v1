import { seedLunchItems } from "@/actions/seedLunchItem";

export async function GET() {
  const result = await seedLunchItems();
  return Response.json(result);
}
