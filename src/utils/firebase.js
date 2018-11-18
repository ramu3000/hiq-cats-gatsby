import firebase from 'firebase'
import 'firebase/firestore'

import config from '../config/uno'

class Firebase {
  constructor() {
    firebase.initializeApp(config)
    this.db = firebase.firestore()
    this.db.settings({
      timestampsInSnapshots: true,
    })
    this.ref = null
  }

  async getVotes() {
    const querySnapshot = await this.db.collection('votes').get()
    const data = []
    querySnapshot.forEach(function(doc) {
      data.push({
        id: doc.id,
        count: doc.data().count,
      })
    })
    return data
  }

  onSubscribe(cb) {
    this.ref = this.db.collection('votes').onSnapshot(cb, console.error)
  }
  onUnsubscribe() {
    this.ref()
  }

  setVotes(id, count) {
    const docData = {
      count,
    }
    this.db
      .collection('votes')
      .doc(id)
      .set(docData)
      .catch(function(error) {
        console.error('Error adding document: ', error)
      })
  }

  getUserVotes(userid) {
    return this.db
      .collection('userVotes')
      .doc(userid)
      .get()
  }

  setUserVote(userid, catpostids) {
    const docData = {
      catpostids: catpostids,
    }

    this.db
      .collection('userVotes')
      .doc(userid)
      .set(docData)
      .catch(function(error) {
        console.error('Error adding document: ', error)
      })
  }
}

export default new Firebase()
