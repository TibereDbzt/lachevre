/**
 * Represents a player's win/loss history as a string of 'W' and 'L' characters.
 * 
 * Ex: 'W', 'WW', 'WL', 'LWL', etc.
 */
export type WinLossHistoryString = string

export class Player {
    public winLossHistory: WinLossHistoryString = ''
    public positionHistory: number[] = []
    
    constructor(public name: string) {}

    public get lastPosition(): number {
        return this.positionHistory[this.positionHistory.length - 1]
    }

    public addVictory(): void {
        this.winLossHistory += 'W'
    }

    public addDefeat(): void {
        this.winLossHistory += 'L'
    }

    public addPosition(position: number): void {
        this.positionHistory.push(position)
    }

    public removeLastRoundResult(): void {
        this.winLossHistory = this.winLossHistory.slice(0, -1)
        this.positionHistory.pop()
    }

    public toJSON(): Record<any, any> {
        return {
            name: this.name,
            winLossHistory: this.winLossHistory,
            positionHistory: this.positionHistory
        }
    }

    public static fromJSON(data: Record<any, any>): Player {
        const player = new Player(data.name)
        player.winLossHistory = data.winLossHistory
        player.positionHistory = data.positionHistory
        return player
    }
}