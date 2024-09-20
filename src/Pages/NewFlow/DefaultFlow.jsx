// const defaultFlow = {
//   edges: [
//     {
//       id: "start-edge",
//       source: "start",
//       target: "0"
//     },
//     {
//       id: "reactflow__edge-1option-0-2",
//       type: "smoothstep",
//       source: "1",
//       target: "2",
//       sourceHandle: "option-0",
//       targetHandle: null
//     },
//     {
//       id: "reactflow__edge-0-1",
//       type: "smoothstep",
//       source: "0",
//       target: "1",
//       sourceHandle: null,
//       targetHandle: null
//     }
//   ],
//   nodes: [
//     {
//       id: "start",
//       data: {
//         label: "Start"
//       },
//       type: "start",
//       position: {
//         x: 0,
//         y: 0
//       }
//     },
//     {
//       id: "0",
//       data: {
//         fields: {
//           type: "Image",
//           content: {
//             url: "https://pdffornurenai.blob.core.windows.net/pdf/hero2_3_ll.png?sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-06-01T16:13:31Z&st=2024-06-01T08:13:31Z&spr=https&sig=8s7IAdQ3%2B7zneCVJcKw8o98wjXa12VnKNdylgv02Udk%3D",
//             text: "",
//             med_id: "1055655572891000",
//             caption: ""
//           }
//         }
//       },
//       type: "sendMessage",
//       position: {
//         x: 267.6097904312476,
//         y: 173.0349274166635
//       }
//     },
//     {
//       id: "1",
//       data: {
//         options: [
//           "ccc",
//           "cccc"
//         ],
//         dataType: "",
//         question: "sfdsds",
//         variable: "",
//         optionType: "Buttons"
//       },
//       type: "askQuestion",
//       position: {
//         x: 775.6,
//         y: 144.8
//       }
//     },
//     {
//       id: "2",
//       data: {
//         condition: "czdsdasd"
//       },
//       type: "setCondition",
//       position: {
//         x: 1268.6,
//         y: 205.8
//       }
//     }
//   ],
//   start: "0",
//   fallback_count: 1,
//   fallback_message: "hello world"
// };

// export default defaultFlow;



const defaultFlow = {
    edges: [
      {
        id: "start-edge",
        source: "start",
        target: "16"
      },
      {
        id: "reactflow__edge-16-1",
        type: "smoothstep",
        source: "16",
        target: "1",
        sourceHandle: null,
        targetHandle: null
      },
      {
        id: "reactflow__edge-1option-0-3",
        type: "smoothstep",
        source: "1",
        target: "3",
        sourceHandle: "option-0",
        targetHandle: null
      },
      {
        id: "reactflow__edge-1option-1-5",
        type: "smoothstep",
        source: "1",
        target: "5",
        sourceHandle: "option-1",
        targetHandle: null
      },
      {
        id: "reactflow__edge-1option-2-4",
        type: "smoothstep",
        source: "1",
        target: "4",
        sourceHandle: "option-2",
        targetHandle: null
      },
      {
        id: "reactflow__edge-3option-0-8",
        type: "smoothstep",
        source: "3",
        target: "8",
        sourceHandle: "option-0",
        targetHandle: null
      },
      {
        id: "reactflow__edge-3option-1-2",
        type: "smoothstep",
        source: "3",
        target: "2",
        sourceHandle: "option-1",
        targetHandle: null
      },
      {
        id: "reactflow__edge-3option-2-1",
        type: "smoothstep",
        source: "3",
        target: "1",
        sourceHandle: "option-2",
        targetHandle: null
      },
      {
        id: "reactflow__edge-2-6",
        type: "smoothstep",
        source: "2",
        target: "6",
        sourceHandle: null,
        targetHandle: null
      },
      {
        id: "reactflow__edge-6true-1",
        type: "smoothstep",
        source: "6",
        target: "1",
        sourceHandle: "true",
        targetHandle: null
      },
      {
        id: "reactflow__edge-6false-7",
        type: "smoothstep",
        source: "6",
        target: "7",
        sourceHandle: "false",
        targetHandle: null
      },
      {
        id: "reactflow__edge-8option-0-10",
        type: "smoothstep",
        source: "8",
        target: "10",
        sourceHandle: "option-0",
        targetHandle: null
      },
      {
        id: "reactflow__edge-8option-1-12",
        type: "smoothstep",
        source: "8",
        target: "12",
        sourceHandle: "option-1",
        targetHandle: null
      },
      {
        id: "reactflow__edge-8option-2-1",
        type: "smoothstep",
        source: "8",
        target: "1",
        sourceHandle: "option-2",
        targetHandle: null
      },
      {
        id: "reactflow__edge-10-6",
        type: "smoothstep",
        source: "10",
        target: "6",
        sourceHandle: null,
        targetHandle: null
      },
      {
        id: "reactflow__edge-12-6",
        type: "smoothstep",
        source: "12",
        target: "6",
        sourceHandle: null,
        targetHandle: null
      },
      {
        id: "reactflow__edge-5option-0-11",
        type: "smoothstep",
        source: "5",
        target: "11",
        sourceHandle: "option-0",
        targetHandle: null
      },
      {
        id: "reactflow__edge-5option-1-13",
        type: "smoothstep",
        source: "5",
        target: "13",
        sourceHandle: "option-1",
        targetHandle: null
      },
      {
        id: "reactflow__edge-5option-2-1",
        type: "smoothstep",
        source: "5",
        target: "1",
        sourceHandle: "option-2",
        targetHandle: null
      },
      {
        id: "reactflow__edge-5option-3-9",
        type: "smoothstep",
        source: "5",
        target: "9",
        sourceHandle: "option-3",
        targetHandle: null
      },
      {
        id: "reactflow__edge-11-14",
        type: "smoothstep",
        source: "11",
        target: "14",
        sourceHandle: null,
        targetHandle: null
      },
      {
        id: "reactflow__edge-13-14",
        type: "smoothstep",
        source: "13",
        target: "14",
        sourceHandle: null,
        targetHandle: null
      },
      {
        id: "reactflow__edge-14true-1",
        type: "smoothstep",
        source: "14",
        target: "1",
        sourceHandle: "true",
        targetHandle: null
      },
      {
        id: "reactflow__edge-14false-15",
        type: "smoothstep",
        source: "14",
        target: "15",
        sourceHandle: "false",
        targetHandle: null
      },
      {
        id: "reactflow__edge-9option-0-1",
        type: "smoothstep",
        source: "9",
        target: "1",
        sourceHandle: "option-0",
        targetHandle: null
      }
    ],
    nodes: [
      {
        id: "start",
        data: {
          label: "Start"
        },
        type: "start",
        position: {
          x: 0,
          y: 0
        }
      },
      {
        id: "16",
        data: {
          fields: {
            type: "text",
            content: {
              text: "Hi There, hope youre doing well!"
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 165.914196333924,
          y: 150.04524173321323
        }
      },
      {
        id: "1",
        data: {
          options: [
            "I've booked my stay",
            "Checking in shortly",
            "Shimla fun spots"
          ],
          dataType: "string",
          question: "Hey there! Welcome to Hotel Backwoods Retreat, Shimla. I am your Whatsapp friend to prepare you well for your upcoming stay at our hotel. \n\nWe promise to make your stay hassle-free! \n\nSelect the stage you are at:",
          variable: "temp1",
          optionType: "Buttons"
        },
        type: "askQuestion",
        position: {
          x: 789.0792895041068,
          y: -135.07174886170924
        }
      },
      {
        id: "3",
        data: {
          options: [
            "Check-in day services",
            "Cancellation Policy",
            "Go back"
          ],
          dataType: "",
          question: "Thank you for choosing to stay with us. Before you reach, here is some useful information for you:\n\n1. Location of the hotel: https://maps.app.goo.gl/61wkHWPJVwgi8iAD6\n2. Check-in time: 12 noon\n3. Check-out time: 11 AM\n4. Facilities: \n- Tea/Coffee Maker\n- 12 Inch Mattresses\n- 24×7 Running Hot/Cold Water\n- Attached Washrooms\n- Scenic Forest Views\n- Hot Water Bottles in Winters\n- Immediate Room Service\n- Ample Storage Space",
          variable: "",
          optionType: "Lists"
        },
        type: "askQuestion",
        position: {
          x: -354.3308211748492,
          y: -769.125502948788
        }
      },
      {
        id: "5",
        data: {
          options: [
            "View restaurant menu",
            "FAQs about the hotel",
            "Go back",
            "Queries after check-out"
          ],
          dataType: "",
          question: "Welcome to Backwoods Retreat! We are so happy to host you with us. :) \n\nHere is some useful information for you:\n1. WiFi password: 12345678\n2. Check-in time: 12 noon\n3. Check-out time: 11 AM\n4. Hot water: Switch the geyser on for 10-15 mins, and turn the nozzle left for hot water. Please switch the geyser off before leaving the room \n5. Car & Bike rental: 94180 36355\n6. Must-try Restaurants in Shimla:\n- Vegetarians: Hotel 1\n- Non-vegetarians: Hotel 2",
          variable: "",
          optionType: "Lists"
        },
        type: "askQuestion",
        position: {
          x: 1501.4614839522528,
          y: 405.1009022341056
        }
      },
      {
        id: "4",
        data: {
          fields: {
            type: "text",
            content: {
              text: "Book now!\n\n1. Things to do in Hotel premises: https://backwoodsretreat.in/things-to-do/\n\n2. Things to do in Shimla: https://www.bookmyxperience.com/search/Shimla\n\n3. There is also a Shared vehicle that leaves the hotel lobby every Saturday & Sunday at 9 AM for local Shimla tour ({{INR899}}). Call 8800312436 for more details. Book before the slots fill up! \n\n4. For travel experiences across the country, visit www.bookmyxperience.com",
              med_id: "",
              caption: ""
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 1123.149899342683,
          y: 971.1297208275519
        }
      },
      {
        id: "8",
        data: {
          options: [
            "Pick-up options",
            "Self check-in",
            "Go back"
          ],
          dataType: "string",
          question: "Choose one",
          variable: "temp",
          optionType: "Lists"
        },
        type: "askQuestion",
        position: {
          x: 1592.2791149463915,
          y: -324.93530345214674
        }
      },
      {
        id: "2",
        data: {
          fields: {
            type: "text",
            content: {
              text: "1. 100% refund for cancellation before 7 days\n2. 50% refund for cancellation before 3 days \n3. 10% refund for cancellation before 1 day\n4. No refund for cancellation on the day of the stay "
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 605.2721451726668,
          y: -791.591847468887
        }
      },
      {
        id: "6",
        data: {
          condition: "Hope this was useful. Do you want to go back?"
        },
        type: "setCondition",
        position: {
          x: 1268.66502991348,
          y: -690.5749991722107
        }
      },
      {
        id: "7",
        data: {
          fields: {
            type: "text",
            content: {
              text: "I enjoyed chatting with you :) Feel free to reach out to me in case of any queries. Thank you."
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 2189.448994147126,
          y: -791.1394493075094
        }
      },
      {
        id: "10",
        data: {
          fields: {
            type: "text",
            content: {
              text: "Welcome to Shimla!\n\nWe would be happy to pick you up from the airport, railway station, bus-stand or any common landmark. You can call 78071 87351 (hotel pick-up), or 94180 36355 (vehicle service)\n\nSee you soon! \n\nPlease book 1 day in advance, to help us help you better.\n"
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 2158.237756658051,
          y: -501.3861300883983
        }
      },
      {
        id: "12",
        data: {
          fields: {
            type: "text",
            content: {
              text: "Self-check in before arriving. Whatsapp these documents on 78071 87351 (reception), and save time! \n- Aadhar card (front & back) of the person who has made the booking\n- OR Any other photo identity proof\n\nYour cozy room awaits you, see you soon!"
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 2234.717702092025,
          y: 92.09824647923915
        }
      },
      {
        id: "11",
        data: {
          fields: {
            type: "text",
            content: {
              text: "WIP"
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 2102.689990709836,
          y: 624.2233193412416
        }
      },
      {
        id: "13",
        data: {
          fields: {
            type: "text",
            content: {
              text: "WIP"
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 2269.3132522304695,
          y: 1049.4179972765278
        }
      },
      {
        id: "14",
        data: {
          condition: "Hope this was useful. Do you want to go back?"
        },
        type: "setCondition",
        position: {
          x: 2848.867472916145,
          y: 862.972259614082
        }
      },
      {
        id: "15",
        data: {
          fields: {
            type: "text",
            content: {
              text: "I enjoyed chatting with you :) Feel free to reach out to me in case of any queries. Thank you"
            }
          }
        },
        type: "sendMessage",
        position: {
          x: 3587.9114209998156,
          y: 1166.2273750891443
        }
      },
      {
        id: "9",
        data: {
          options: [
            "Go back"
          ],
          dataType: "",
          question: "Thank you for staying with Backwoods Retreat! We hope you have a relaxing and memorable time.\n\nHere is some useful information for you:\n1. Forgot something at the hotel? Don't worry, call the hotel and we will help you find it : 78071 87351\n2. We would be happy to drop you to the airport, railway station, bus-stand or any common landmark. You can call 78071 87351 (hotel pick-up), or 94180 36355 (vehicle service)\n3. Leave feedback, help us be better: https://shorturl.at/6U1lQ",
        variable: "",
        optionType: "Lists"
      },
      type: "askQuestion",
      position: {
        x: -1.6662892304855177,
        y: 1562.6658587309887
      }
    }
  ],
  start: "16",
  fallback_count: 3,
  fallback_message: "please provide correct input"
};

export default defaultFlow;