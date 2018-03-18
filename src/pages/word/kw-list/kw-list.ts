import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { CommonProvider } from './../../../providers/common-provider';
import { WordProvider } from './../../../providers/word-provider';

import { WordSearch } from './../../../models/WordSearch';
import { Word } from './../../../models/Word';

@Component({
    selector: 'page-kwList',
    templateUrl: 'kw-list.html'
})
export class KwListPage {

    words: Array<Word>;
    ws: WordSearch;
    title: string;

    constructor(
        private param: NavParams,
        private _cmn: CommonProvider,
        private _word: WordProvider
    ) {
        this.initData();
    }

    initData(): void {
        this.ws = this.param.get("wordSearch");

        this.setTitle();
        this.getWords();
    }

    setTitle(): void {
        if (this.ws.randomed) {
            this.title = this.ws.cat.name;
        } else {
            this.title = this.ws.lec.name;
        }
    }

    getWords(): void {
        const loader = this._cmn.getLoader(null, null);
        loader.present();

        this._word.getWordsBySearch(this.ws)
            .then(words_ => {
                for (let i = 0; i < words_.length; i++) {
                    words_[i].flag1 = false;
                    words_[i].flag2 = false;

                    words_[i].col15 = this.createMeString(words_[i]);
                    words_[i].col16 = this.createExString(words_[i]);
                }
                this.words = words_;
                loader.dismiss();
            })
            .catch(err => {
                loader.dismiss();
                console.log(err);
                alert(err);
            });
    }

    private createMeString(word: Word): string {
        let result: string = null;

        (word.col01 == null) ? null : (result = word.col01);
        (word.col02 == null) ? null : (result += "\n" + word.col02);
        (word.col03 == null) ? null : (result += "\n" + word.col03);
        (word.col04 == null) ? null : (result += "\n" + word.col04);
        (word.col05 == null) ? null : (result += "\n" + word.col05);
        (word.col06 == null) ? null : (result += "\n" + word.col06);
        (word.col07 == null) ? null : (result += "\n" + word.col07);

        return result;
    }

    private createExString(word: Word): string {
        let result: string = null;

        (word.col09 == null) ? null : (result = word.col09);
        (word.col10 == null) ? null : (result += "\n" + word.col10);
        (word.col11 == null) ? null : (result += "\n" + word.col11);
        (word.col12 == null) ? null : (result += "\n" + word.col12);
        (word.col13 == null) ? null : (result += "\n" + word.col13);
        (word.col14 == null) ? null : (result += "\n" + word.col14);

        return result;
    }

    clickThumbs(word: Word, thumbCode: number): void {
        const level: number = thumbCode + (word.levelId == undefined ? 0 : word.levelId);

        if (level > 2 || level < -2) {
            return;
        } else {
            this._word.updateWordLevel(word.id, level)
                .then(() => word.levelId = level);
        }
    }

    // requestModification(word: Word): void {
    //     const params = {
    //         activeName: CommonUtil.getActiveName(this.ws.sub.id),
    //         subId: this.ws.sub.id,
    //         catId: this.ws.cat.id,
    //         word: word
    //     }

    //     this.navCtrl.push(RequestPage, params);
    // }

    shuffleQue(): void {
        const loader = this._cmn.getLoader(null, null);
        loader.present();

        let words_: Array<Word> = this.words.shuffleArray();

        words_.forEach(word => {
            word.flag1 = false;
        });

        this.words = words_;

        loader.dismiss();
    }
}