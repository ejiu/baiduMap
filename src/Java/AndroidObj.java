package com.keenvision.compass;

import android.util.Log;
import android.webkit.JavascriptInterface;

import com.baidu.location.LocationClient;

import java.util.Timer;
import java.util.TimerTask;

public class AndroidObj extends Object {
    Timer timer = new Timer();
    MainActivity test;
    LocationClient locationClient;
    static String GPSinfo = "";
    static String IMEI = "";

    AndroidObj(MainActivity tmp){
        test = tmp;
    }

    public void setLocationClient(LocationClient locationClient) {
        this.locationClient = locationClient;
    }

    @JavascriptInterface
    public String getGPSinfo() {
        locationClient.start();
        //延迟1秒关闭
        timer.schedule(new TimerTask(){
            public void run(){
                locationClient.stop();
                this.cancel();
            }
        },1000);

        Log.i("GPSinfo", "Got GPSinfo: " + GPSinfo);
//        locationClient.stop();
        return GPSinfo;
    }

    @JavascriptInterface
    public String getIMEI(){
        if(test != null){
            IMEI = test.getIMEI();
        }
        Log.i("GPSinfo", "IMEI" + IMEI);
        return IMEI;
    }

    public static void updateGpsInfo(String info){
        GPSinfo = info;

    }
}