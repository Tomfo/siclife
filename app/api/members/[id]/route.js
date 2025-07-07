import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
	const id = (await params).id;
	const user = await prisma.person.findUnique({
		where: { id: Number(id) },
		include: {
			children: {
				select: {
					id: true,
					fullName: true,
					birthday: true,
				},
			},
			parents: {
				select: {
					id: true,
					fullName: true,
					birthday: true,
					relationship: true,
				},
			},
		},
	});

	if (!user) {
		return Response.json({ error: 'User not found' }, { status: 404 });
	}

	return Response.json(user);
}

export async function DELETE(request, { params }) {
	try {
		const id = (await params).id;
		await prisma.person.delete({
			where: { id: Number(id) },
		});
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to delete post' },
			{ status: 500 }
		);
	}
}

export async function PUT(request, { params }) {
	try {
		const id = (await params).id;
		const { children = [], parents = [], ...memberData } = await request.json();

		const existingMember = await prisma.person.findUnique({
			where: { id: Number(id) },
			include: { children: true, parents: true },
		});

		if (!existingMember) {
			return NextResponse.json({ error: 'Record not found' }, { status: 404 });
		}
		// CHILDREN UPDATES, DELETES AND NEW DATA
		const existingChildIds = existingMember.children.map((child) => child.id);
		const newChildIds = children
			.filter((child) => child.id)
			.map((child) => child.id);

		const childrenToDelete = existingChildIds.filter(
			(id) => !newChildIds.includes(id)
		);
		const childrenToCreate = children
			.filter((child) => !child.id)
			.map((child) => ({
				fullName: child.fullName,
				birthday: child.birthday,
			}));

		const childrenToUpdate = children.filter((child) => child.id);

		//--------------------------------------------------------------------
		// PARENTS UPDATES, DELETES AND NEW DATA
		const existingParentIds = existingMember.parents.map((parent) => parent.id);
		const newParentIds = parents
			.filter((parent) => parent.id)
			.map((parent) => parent.id);

		const parentsToDelete = existingParentIds.filter(
			(id) => !newParentIds.includes(id)
		);
		const parentsToCreate = parents
			.filter((parent) => !parent.id)
			.map((parent) => ({
				fullName: parent.fullName,
				birthday: parent.birthday,
				relationship: parent.relationship,
			}));

		const parentsToUpdate = parents.filter((parent) => parent.id);

		//---------------------------------------------------------------------------------

		const updatedMember = await prisma.person.update({
			where: { id: Number(id) },
			data: {
				...memberData,
				children: {
					deleteMany: {
						id: { in: childrenToDelete },
					},
					createMany: {
						data: childrenToCreate,
					},
					updateMany: childrenToUpdate.map((child) => ({
						where: { id: child.id },
						data: { fullName: child.fullName, birthday: child.birthday },
					})),
				},
				parents: {
					deleteMany: {
						id: { in: parentsToDelete },
					},
					createMany: {
						data: parentsToCreate,
					},
					updateMany: parentsToUpdate.map((parent) => ({
						where: { id: parent.id },
						data: {
							fullName: parent.fullName,
							birthday: parent.birthday,
							relationship: parent.relationship,
						},
					})),
				},
			},
			include: { children: true, parents: true },
		});

		return NextResponse.json({ updatedMember }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: 'Update failed' }, { status: 400 });
	}
}
