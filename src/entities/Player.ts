/**
 * Represents a player's win/loss history as a string of 'W' and 'L' characters.
 * 
 * Ex: 'W', 'WW', 'WL', 'LWL', etc.
 */
export type WinLossHistoryString = string

export class Player {
    public winLossHistory: WinLossHistoryString = ''
    public positionHistory: number[] = []
    public pointsHistory: number[] = []
    
    constructor(public name: string) {}

    public get lastPosition(): number {
        return this.positionHistory[this.positionHistory.length - 1]
    }

    public get totalPoints(): number {
        return this.pointsHistory.reduce((a, b) => a + b, 0)
    }

    public addVictory(): void {
        console.log(this.name, 'add victory')
        this.winLossHistory += 'W'
    }

    public addDefeat(): void {
        this.winLossHistory += 'L'
    }

    public addPosition(position: number): void {
        this.positionHistory.push(position)
    }

    public setCurrentRoundPoints(points: number): void {
        this.pointsHistory[this.pointsHistory.length - 1] = points
    }

    public removeLastRoundResult(shouldRemovePoints: boolean = true): void {
        this.winLossHistory = this.winLossHistory.slice(0, -1)
        this.positionHistory.pop()
        if (shouldRemovePoints) this.pointsHistory.pop()
    }

    public toJSON(): Record<any, any> {
        return {
            name: this.name,
            winLossHistory: this.winLossHistory,
            positionHistory: this.positionHistory,
            pointsHistory: this.pointsHistory
        }
    }

    public static fromJSON(data: Record<any, any>): Player {
        const player = new Player(data.name)
        player.winLossHistory = data.winLossHistory
        player.positionHistory = data.positionHistory
        player.pointsHistory = data.pointsHistory
        return player
    }
}