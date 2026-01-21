import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prisma/client';
import { config } from '../config';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const jwtOptions: SignOptions = { expiresIn: '7d' };

const router = Router();

const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6), name: z.string().min(2) });
const loginSchema = z.object({ email: z.string().email(), password: z.string() });

router.post('/register', async (req: Request, res: Response) => {
    try {
        const data = registerSchema.parse(req.body);
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: { email: data.email, password: hashedPassword, name: data.name },
            select: { id: true, email: true, name: true, role: true },
        });
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.jwt.secret, jwtOptions);
        res.status(201).json({ user, token });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.jwt.secret, jwtOptions);
        res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role }, token });
    } catch (error) {
        if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors });
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            select: { id: true, email: true, name: true, role: true, preferences: true },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
});

export default router;
