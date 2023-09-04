import { DB } from "@/app/libs/DB";
import { zStudentPostBody, zStudentPutBody } from "@/app/libs/schema";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  const program = request.nextUrl.searchParams.get("program");
  const students = DB.students;

  let filtered = students;
  if (program !== null) {
    filtered = filtered.filter((std) => std.program === program);
  }

  return NextResponse.json({ ok: true, students: filtered });
};

export const POST = async (request) => {
  const body = await request.json();

  const parseResult = zStudentPostBody.safeParse(body);
  if (parseResult.success === false) {
    return NextResponse.json(
      {
        ok: false,
        message: parseResult.error.issues[0].message,
      },
      {
        status: 400,
      }
    );
  }

  //findIndex 0,1,2... = found
  //return -1 = not found
  const foundIndex = DB.students.findIndex(
    (std) => std.studentId === body.studentId
  );
  if (foundIndex >= 0) {
    return NextResponse.json(
      { ok: false, message: "Student Id already exists" },
      { status: 400 }
    );
  }

  DB.students.push(body);

  return NextResponse.json({
    ok: true,
    message: `Student Id ${body.studentId} has been added`,
  });
};

export const PUT = async (request) => {
  const body = await request.json();

  const parseResult = zStudentPutBody.safeParse(body);
  if (parseResult.success === false) {
    return NextResponse.json(
      {
        ok: false,
        message: parseResult.error.issues[0].message,
      },
      {
        status: 400,
      }
    );
  }

  const foundIndex = DB.students.findIndex(
    (std) => std.studentId === body.studentId
  );
  if (foundIndex === -1) {
    return NextResponse.json(
      { ok: false, message: "Student Id does not exists" },
      { status: 404 }
    );
  }

  DB.students[foundIndex] = { ...DB.students[foundIndex], ...body };

  return NextResponse.json({ ok: true });
};
