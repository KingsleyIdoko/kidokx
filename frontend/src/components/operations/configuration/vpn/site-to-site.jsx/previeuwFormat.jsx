{
  /* <rpc-reply xmlns:junos="http://xml.juniper.net/junos/22.4R0/junos">
    <configuration junos:commit-seconds="1741180547" junos:commit-localtime="2025-03-05 13:15:47 UTC" junos:commit-user="root">
            <security>
                <ike>
                    <proposal>
                        <name>proposal-1</name>
                        <authentication-method>pre-shared-keys</authentication-method>
                        <dh-group>group14</dh-group>
                        <authentication-algorithm>sha-256</authentication-algorithm>
                        <encryption-algorithm>aes-128-cbc</encryption-algorithm>
                        <lifetime-seconds>28800</lifetime-seconds>
                    </proposal>
                </ike>
            </security>
    </configuration>
    <cli>
        <banner>{primary:node0}</banner>
    </cli>
</rpc-reply> */
}

// {
//     "configuration" : {
//         "@" : {
//             "junos:commit-seconds" : "1741180547",
//             "junos:commit-localtime" : "2025-03-05 13:15:47 UTC",
//             "junos:commit-user" : "root"
//         },
//         "security" : {
//             "ike" : {
//                 "proposal" : [
//                 {
//                     "name" : "proposal-1",
//                     "authentication-method" : "pre-shared-keys",
//                     "dh-group" : "group14",
//                     "authentication-algorithm" : "sha-256",
//                     "encryption-algorithm" : "aes-128-cbc",
//                     "lifetime-seconds" : 28800
//                 }
//                 ]
//             }
//         }
//     }
// }

// set security ike proposal proposal-1 authentication-method pre-shared-keys
// set security ike proposal proposal-1 dh-group group14
// set security ike proposal proposal-1 authentication-algorithm sha-256
// set security ike proposal proposal-1 encryption-algorithm aes-128-cbc
// set security ike proposal proposal-1 lifetime-seconds 28800
