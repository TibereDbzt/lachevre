import { Round } from "@/entities/Round";
import { Player } from "@/entities/Player";

export class Tournament {
    public name: string = 'LA CHÈVRE'
    public players: Player[] = []
    public rounds: Round[] = []
    public currentRoundIndex: number = 0
    
    constructor() {}

    public get currentRound(): Round {
        return this.rounds[this.currentRoundIndex]
    }

    public addPlayer(playerName: Player['name']): void {
        const isPlayerNameAvailable = this.players.findIndex(player => player.name === playerName) === -1
        if (isPlayerNameAvailable) {
            this.players.push(new Player(playerName))
        }
    }

    public removePlayer(playerName: Player['name']): void {
        this.players = this.players.filter(p => p.name !== playerName)
    }

    public start(): void {
        this.rounds.push(new Round(this.players))
    }

    public toNextRound(): void {
        if (this.rounds.length === 0) {
            throw new Error('No previous round to base next round on')
        }

        this.currentRound.finish()

        const newRound = new Round(this.players)
        this.rounds.push(newRound)
        this.currentRoundIndex = this.rounds.length - 1
    }

    public deleteRound(): void {
        this.players.forEach(player => player.removeLastRoundResult())
        this.rounds.pop()
        this.currentRoundIndex--
    }

    public get isOnLastRound(): boolean {
        return this.currentRoundIndex === this.rounds.length - 1
    }

    public get hasEnoughPlayers(): boolean {
        return this.players.length > 6
    }

    public get hasRounds(): boolean {
        return this.rounds.length > 0
    }

    public get hasPools(): boolean {
        return this.currentRound.playerGroups.every(group => group.poolsHasBeenCreated)
    }

    public toJSON(): Record<any, any> {
        return {
            name: this.name,
            players: this.players.map(player => player.toJSON()),
            rounds: this.rounds.map(round => round.toJSON()),
            currentRoundIndex: this.currentRoundIndex
        }
    }

    public static fromJSON(data: Record<any, any>): Tournament {
        const tournament = new Tournament()
        
        tournament.name = data.name
        tournament.players = data.players.map((playerData: Record<any, any>) => Player.fromJSON(playerData))

        tournament.rounds = data.rounds.map((roundData: any) => Round.fromJSON(roundData, tournament.players))
        
        tournament.currentRoundIndex = data.currentRoundIndex
        return tournament
    }
}