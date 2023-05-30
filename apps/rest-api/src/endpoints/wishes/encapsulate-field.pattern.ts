//// Before refactoring
class Wish {
  public title: string;
  public price: number;
  public cover: string;
  public rating: number;
}

//// After refactoring
class Wish2 {
  private _title: string;
  private _price: number;
  private _cover: string;
  private _rating: number;

  public get getTitle(): string {
    return this._title;
  }

  public set setTitle(newTitle: string) {
    this._title = newTitle;
  }

  public get getPrice(): number {
    return this._price;
  }

  public set setPrice(newPrice: number) {
    this._price = newPrice;
  }

  public get getCover(): string {
    return this._cover;
  }

  public set setCover(newCover: string) {
    this._cover = newCover;
  }

  public get getRating(): number {
    return this._rating;
  }

  public set setRating(newRating: number) {
    this._rating = newRating;
  }
}
