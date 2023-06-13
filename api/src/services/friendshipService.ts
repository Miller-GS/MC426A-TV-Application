import { getRepository } from 'typeorm';
import { Friendship, FriendshipStatus } from './entities/Friendship';
import { User } from './entities/User';

class FriendshipService {
    async addFriend(user1Id: number, user2Id: number) {
        const userRepository = getRepository(User);
        const friendshipRepository = getRepository(Friendship);

        // Check if users exist
        const user1 = await userRepository.findOne(user1Id);
        const user2 = await userRepository.findOne(user2Id);

        if (!user1 || !user2) {
            throw new Error('One or both users not found');
        }

        // Check if friendship already exists
        const existingFriendship = await friendshipRepository.findOne({ user_id1: user1Id, user_id2: user2Id });

        if (existingFriendship) {
            throw new Error('Friendship already exists');
        }

        // Create new friendship
        const newFriendship = new Friendship();
        newFriendship.user_id1 = user1Id;
        newFriendship.user_id2 = user2Id;
        newFriendship.status = FriendshipStatus.PENDING;
        newFriendship.action_user_id = user1Id; // The user who initiated the friendship is the action_user

        // Save the friendship
        await friendshipRepository.save(newFriendship);
    }
}

export default new FriendshipService();
