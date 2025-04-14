// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export async function POST(request) {
//     const body = await request.json();
//     const { email, password, username } = body;

//     try {
//         const user = email
//             ? await prisma.user.findUnique({ where: { email } })
//             : await prisma.user.findUnique({ where: { username } });

//         if (!user) {
//             return NextResponse.json({ error: 'User not found' }, { status: 400 });
//         }

//         if (!user.isVerified) {
//             return NextResponse.json({ error: 'User not verified' }, { status: 400 });
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
//         }

//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

//         // return NextResponse.json({ token }, { status: 200 });
//         return NextResponse.json({
//             token,
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 username: user.username,
//                 isVerified: user.isVerified,
//                 balance: user.balance,
//                 createdAt: user.createdAt,
//             }
//         }, { status: 200 });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//     }
// }


// app/api/auth/login/route.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';



const prisma = new PrismaClient();
export async function POST(request) {
    let body;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }

        // Optional: skip this if you're not verifying users
        // if (user.isVerified === false) {
        //     return NextResponse.json({ error: 'User not verified' }, { status: 400 });
        // }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isVerified: true,
                balance: user.balance,
                createdAt: user.createdAt,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
