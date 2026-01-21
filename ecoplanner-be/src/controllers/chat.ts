import { Router, Response } from 'express';
import { authMiddleware, adminMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { chatService } from '../services/ChatService';

const router = Router();

router.post('/send', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });
        const conversation = await chatService.getOrCreateConversation(req.user!.userId);
        await chatService.sendMessage(conversation.id, message, 'USER');
        const { message: aiMessage, shouldHandover } = await chatService.getAIResponse(conversation.id);
        res.json({ conversationId: conversation.id, message: aiMessage, shouldHandover });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process message' });
    }
});

router.get('/history/:conversationId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const messages = await chatService.getConversationHistory(req.params.conversationId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

router.get('/conversations', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const conversations = await chatService.getActiveConversations();
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

router.get('/attention', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const conversations = await chatService.getConversationsNeedingAttention();
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

router.post('/:conversationId/assign', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const conversation = await chatService.assignConversation(req.params.conversationId, req.user!.userId);
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign conversation' });
    }
});

router.post('/:conversationId/resolve', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const conversation = await chatService.resolveConversation(req.params.conversationId, req.user!.userId);
        res.json(conversation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve conversation' });
    }
});

router.post('/:conversationId/admin-message', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });
        const savedMessage = await chatService.sendMessage(req.params.conversationId, message, 'ADMIN');
        res.json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

export default router;
