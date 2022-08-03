// miniprogram/pages/liferestart/talents.js
// 颜值 charm CHR
// 智力 intelligence INT
// 体质 strength STR
// 家境 money MNY
// 快乐 spirit SPR
// 生命 life LIF
// 天赋 talent TLT
// 事件 event EVT

import {
    randomTalents,
    computeTalentsStatus,
    computeUseableProp,
    randomProp
} from '../../utils/liferestart/data/dataUtils.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        talentsArray: [],
        selectedTalentsID: [],
        selectedTalents: [],
        showSelectTalents: false,
        checkType: true,
        checkIndex: 0,
        checkArry: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        // console.log('telents page onLoad')
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })
    },
    onShow: function () {
        this.clearStorage()
        this.loadTalents()
        this.setData({
            showSelectTalents: false,
            checkType: true,
            checkIndex: 0,
            checkArry: []
        })
    },

    clearStorage: function () {
        this.setData({
            talentsArray: [],
            selectedTalentsID: [],
            selectedTalents: []
        })
        wx.removeStorageSync('selectedTalentsID')
        wx.removeStorageSync('selectedTalents')
        wx.removeStorageSync('propertyCHR')
        wx.removeStorageSync('propertyINT')
        wx.removeStorageSync('propertySTR')
        wx.removeStorageSync('propertyMNY')
        wx.removeStorageSync('currentRecord')
        wx.removeStorageSync('trajectory')
    },

    loadTalents: function () {
        const showTalents = randomTalents(10);
        showTalents.forEach(e => {
            e.checkType = false
        })
        // console.log('telents page loadTalents', showTalents)
        this.setData({
            talentsArray: showTalents
        })
    },

    changeIcon(e) {
        let checkType = this.data.checkType;
        let checkIndex = e.currentTarget.id;
        let talentsArray = this.data.talentsArray;
        let checkArry = this.data.checkArry;

        if (checkArry.indexOf(checkIndex) == -1) {
            if (checkArry.length < 3) {
                checkArry.push(checkIndex);
                talentsArray[checkIndex].checkType = true;
            } else {
                wx.showToast({
                    title: '最多选择三项',
                    icon: 'none'
                })
            }
        } else {
            talentsArray[checkIndex].checkType = false;
            checkArry.splice(checkArry.indexOf(checkIndex), 1);
        }

        console.log(checkArry, checkArry.indexOf(checkIndex))

        this.setData({
            checkType: !checkType,
            checkIndex,
            talentsArray,
            checkArry
        })
    },

    onSelectTalents(e) {

        const tData = this.data;
        var itemValue = e.detail.value;
        var selectedIndex = []; //选中的下标
        var selectedValue = []; //选中的值
        for (var i = 0; i < itemValue.length; i++) {
            var selectrow = itemValue[i].split(",") //数组以逗号分割
            selectedIndex = selectedIndex.concat(selectrow[0]) //第一个为下标
            selectedValue = selectedValue.concat(selectrow[1]) //第二个为值
        }

        // console.log('onSelectTalents e', tData.talentsArray)

        if (selectedValue.length > 3) {
            wx.showToast({
                title: '只能选三个天赋',
                icon: 'none'
            })

            e.detail.selectedIndex.pop()
        }

        tData.talentsArray.forEach((item) => {
            item.disabled = false
        });
        tData.selectedTalents = []
        // console.log('selectedIndex',selectedValue)
        if (selectedValue.length == 3) {
            tData.talentsArray.forEach(function (item, idx) {
                // console.log('item',item._id,(selectedValue.includes(item._id)))
                if (selectedValue.includes(item._id)) {
                    item.disabled = false
                } else {
                    // console.log('item2',idx,item.inputChecked)
                    item.disabled = true
                }
            })
        }
        selectedIndex.forEach(function (item, idx) {
            // for (var i = 0; i < selectedIndex.length; i++) {
            const currentTalents = tData.talentsArray[item]
            // console.log('currentTalents=',idx,currentTalents)
            tData.selectedTalents.push(currentTalents)
            if ('exclusive' in currentTalents) {
                const currexc = currentTalents.exclusive
                // console.log('currexc',currexc.length)
                currexc.forEach(function (itemexc, idxexc) {
                    // console.log('currexc',itemexc)
                    tData.talentsArray.forEach(function (itemTal, idxTal) {
                        if (itemTal._id == itemexc) {
                            // console.log('itemTal',itemTal)
                            itemTal.disabled = itemTal._id == itemexc
                        }
                    })
                })
            }
        })
        this.setData({
            talentsArray: tData.talentsArray,
            selectedTalentsID: selectedValue,
            selectedTalents: tData.selectedTalents
        })
        // console.log(this.data.selectedTalentsID)
        wx.setStorage({
            key: 'selectedTalentsID',
            data: this.data.selectedTalentsID
        })
        wx.setStorage({
            key: 'selectedTalents',
            data: tData.selectedTalents
        })
        // console.log('checkbox发生change事件，携带value值为：', this.data.selectedTalents)
        // }
    },
    showTalents(e) {
        this.setData({
            showSelectTalents: true
        })
    },
    randomLife(e) {
        const selectedTalents = randomTalents(3)
        const selectedTalentsID = selectedTalents.map(function (item) {
            return item._id
        });
        const status = computeTalentsStatus(selectedTalents)
        // console.log('status', status)
        const proNum = computeUseableProp(20, status)
        const arr = randomProp(proNum, [10, 10, 10, 10])
        console.log('selectedTalentsID', selectedTalentsID, proNum, arr)
        wx.setStorage({
            key: 'selectedTalentsID',
            data: selectedTalentsID
        })
        wx.setStorage({
            key: 'selectedTalents',
            data: selectedTalents
        })
        wx.setStorage({
            key: 'propertyCHR',
            data: arr[0]
        })
        wx.setStorage({
            key: 'propertyINT',
            data: arr[1]
        })
        wx.setStorage({
            key: 'propertySTR',
            data: arr[2]
        })
        wx.setStorage({
            key: 'propertyMNY',
            data: arr[3]
        })
        wx.redirectTo({
            url: '../trajectory/trajectory'
        })
    },

    toProperty(e) {
        if (this.data.selectedTalents.length < 3) {
            wx.showToast({
                title: '请选择三个天赋',
                icon: 'none'
            })

        } else {
            wx.redirectTo({
                url: '../property/property'
            })
        }
    },
    onShareTimeline(e) {
        return {
            title: "人生重开模拟器"
        }
    },
    onShareAppMessage: function () {
        return {
            title: '人生重开模拟器'
        }
    },

})