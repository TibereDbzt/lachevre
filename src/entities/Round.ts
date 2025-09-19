import { Player, type WinLossHistoryString } from "@/entities/Player"
import { PlayerGroup } from "@/entities/PlayerGroup"


export class Round {
    public players: Player[] = []
    public playerGroups: PlayerGroup[] = []
    
    constructor(players: Player[]) {
        this.players = players
        this.createPlayerGroups()
    }

    private createPlayerGroups(): void {
        if (this.players.length === 0) return
        
        const groupsMap: { [history: WinLossHistoryString]: Player[] } = {}
        
        this.players.forEach(player => {
            const history = player.winLossHistory
            if (!groupsMap[history]) groupsMap[history] = []
            groupsMap[history].push(player)
        })
        
        this.playerGroups = Object.entries(groupsMap).map(
            ([history, players]) => new PlayerGroup(history, players)
        )
    }

    public finish(): void {
        this.playerGroups.forEach(group => {
            group.finishRound()
        })
    }

    public toJSON(): Record<any, any> {
        return {
            players: this.players.map(player => player.toJSON()),
            playerGroups: this.playerGroups.map(group => group.toJSON())
        }
    }

    public static fromJSON(data: Record<any, any>, allPlayers: Player[]): Round {
        const round = Object.create(Round.prototype)
        round.players = data.players.map((playerData: Record<any, any>) => Player.fromJSON(playerData))
        round.playerGroups = data.playerGroups.map((groupData: Record<any, any>) => 
            PlayerGroup.fromJSON(groupData, allPlayers)
        )
        return round
    }
}
