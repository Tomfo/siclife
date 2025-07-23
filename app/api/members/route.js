import prisma from '@/lib/prisma';

export async function GET() {
	console.log('fetching data from member GET route');
	try {
		const data = await prisma.person.findMany({
			orderBy: {
				lastName: 'asc',
			},
		});
		return Response.json(data);
	} catch (error) {
		return Response.json({ error: 'Failed to fetch members' }, { status: 500 });
	}
}

export async function POST(request) {
	console.log(request.body);
	try {
		const {
			nationalId,
			idType,
			firstName,
			middleName,
			lastName,
			gender,
			birthday,
			spouseFullname,
			spousebirthday,
			email,
			telephone,
			residence,
			underlying,
			condition,
			declaration,
			children,
			parents,
		} = await request.json();

		const newPerson = await prisma.person.create({
			data: {
				nationalId,
				idType,
				firstName,
				middleName,
				lastName,
				gender,
				birthday,
				spouseFullname,
				spousebirthday,
				email,
				telephone,
				residence,
				underlying,
				condition,
				declaration,
				children: {
					createMany: {
						data: children.map((child) => ({
							fullName: child.fullName,
							birthday: child.birthday,
						})),
					},
				},
				parents: {
					createMany: {
						data: parents.map((parent) => ({
							fullName: parent.fullName,
							birthday: parent.birthday,
							relationship: parent.relationship,
						})),
					},
				},
			},
			include: {
				parents: true,
				children: true,
			},
		});
		return Response.json(newPerson, { status: 201 });
	} catch (error) {
		console.log(error);
		return Response.json({ error: 'Failed to create member' }, { status: 500 });
	}
}

// export async function DELETE(_, { params }) {
// 	await prisma.person.delete({
// 		where: { id: Number(params.id) },
// 	});
// 	return new Response(null, { status: 204 });
// }
