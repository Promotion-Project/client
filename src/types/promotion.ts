export interface Promotion {
    id: number;
    name: string;
    date: string;
    sentGifts: number;
    daysToTakeGift: number;
    daysToReceiveGift: number;
    description?: string;
    cardNumbers?: string;
}  