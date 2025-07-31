//react query 
export async function fetchMembers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members`,
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const members = await res.json();
  return members;
}

export async function deleteMember(id) {
  await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`, {
    method: "DELETE",
  });
}

export async function getMemberbyId(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function updateMember({ id, data }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
}
