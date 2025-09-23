import { PlayerGroup } from '@/entities/PlayerGroup'
import { Player } from '@/entities/Player'
import { expect, describe, it } from 'vitest'
import { Pool } from '@/entities/Pool'

describe('Create Pools', () => {
    it('should split firts players in 2 different pools', () => {
        const winnersRankingOfPool1 = [
            new Player('Alain'),
            new Player('Bertrand'),
            new Player('Cindy'),
            new Player('David'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })

        const winnersRankingOfPool2 = [
            new Player('Grégoire'),
            new Player('Isabelle'),
            new Player('Julien'),
            new Player('Hector'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })

        const winnersRankingOfPool3 = [
            new Player('Henri'),
            new Player('Léa'),
            new Player('Maxence'),
            new Player('Nathalie'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })
        
        
        const playerGroup = new PlayerGroup(
            'W',
            [
                ...winnersRankingOfPool1,
                ...winnersRankingOfPool2,
                ...winnersRankingOfPool3
            ]
        )

        playerGroup.createPools(2)

        const pool1 = playerGroup.pools[0]
        const pool2 = playerGroup.pools[1]
        const countPlayersWithPosition = (pool: Pool, position: number) => pool.players.filter(player => player.lastPosition === position).length

        expect(playerGroup.pools.length).toBe(2)

        expect(pool1.players.length).toBe(6)
        expect(pool2.players.length).toBe(6)

        expect(countPlayersWithPosition(pool1, 1)).toBe(2)
        expect(countPlayersWithPosition(pool1, 2)).toBe(2)

        expect(countPlayersWithPosition(pool2, 1)).toBe(1)
        expect(countPlayersWithPosition(pool2, 2)).toBe(1)
    })

    it('should split firts players in 3 different pools', () => {
        const winnersRankingOfPool1 = [
            new Player('Alain'),
            new Player('Bertrand'),
            new Player('Cindy'),
            new Player('David'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })

        const winnersRankingOfPool2 = [
            new Player('Grégoire'),
            new Player('Isabelle'),
            new Player('Julien'),
            new Player('Hector'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })

        const winnersRankingOfPool3 = [
            new Player('Henri'),
            new Player('Léa'),
            new Player('Maxence'),
            new Player('Nathalie'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })
        
        
        const playerGroup = new PlayerGroup(
            'W',
            [
                ...winnersRankingOfPool1,
                ...winnersRankingOfPool2,
                ...winnersRankingOfPool3
            ]
        )

        playerGroup.createPools(3)

        const pool1 = playerGroup.pools[0]
        const pool2 = playerGroup.pools[1]
        const pool3 = playerGroup.pools[2]
        const countOfPlayersWithPosition = (pool: Pool, position: number) => pool.players.filter(player => player.lastPosition === position).length

        expect(playerGroup.pools.length).toBe(3)

        expect(pool1.players.length).toBe(4)
        expect(pool2.players.length).toBe(4)
        expect(pool3.players.length).toBe(4)

        expect(countOfPlayersWithPosition(pool1, 1)).toBe(1)
        expect(countOfPlayersWithPosition(pool1, 2)).toBe(1)

        expect(countOfPlayersWithPosition(pool2, 1)).toBe(1)
        expect(countOfPlayersWithPosition(pool2, 2)).toBe(1)
    })

    it('should split firts players in 4 different pools', () => {
        const winnersRankingOfPool1 = [
            new Player('Alain'),
            new Player('Bertrand'),
            new Player('Cindy'),
            new Player('David'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })

        const winnersRankingOfPool2 = [
            new Player('Grégoire'),
            new Player('Isabelle'),
            new Player('Julien'),
            new Player('Hector'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })

        const winnersRankingOfPool3 = [
            new Player('Henri'),
            new Player('Léa'),
            new Player('Maxence'),
            new Player('Nathalie'),
        ].map((player, index) => {
            player.positionHistory = [index + 1]
            player.addVictory()
            return player
        })
        
        
        const playerGroup = new PlayerGroup(
            'W',
            [
                ...winnersRankingOfPool1,
                ...winnersRankingOfPool2,
                ...winnersRankingOfPool3
            ]
        )

        playerGroup.createPools(4)

        const pool1 = playerGroup.pools[0]
        const pool2 = playerGroup.pools[1]
        const pool3 = playerGroup.pools[2]
        const pool4 = playerGroup.pools[3]
        const countOfPlayersWithPosition = (pool: Pool, position: number) => pool.players.filter(player => player.lastPosition === position).length

        expect(playerGroup.pools.length).toBe(4)

        expect(pool1.players.length).toBe(3)
        expect(pool2.players.length).toBe(3)
        expect(pool3.players.length).toBe(3)
        expect(pool4.players.length).toBe(3)

        expect(countOfPlayersWithPosition(pool1, 1)).toBe(1)
        expect(countOfPlayersWithPosition(pool1, 2)).toBe(1)

        expect(countOfPlayersWithPosition(pool2, 1)).toBe(1)
        expect(countOfPlayersWithPosition(pool2, 2)).toBe(1)

        expect(countOfPlayersWithPosition(pool3, 1)).toBe(1)
        expect(countOfPlayersWithPosition(pool3, 2)).toBe(1)

        expect(countOfPlayersWithPosition(pool4, 1)).toBe(0)
        expect(countOfPlayersWithPosition(pool4, 2)).toBe(0)
    })
})
    
