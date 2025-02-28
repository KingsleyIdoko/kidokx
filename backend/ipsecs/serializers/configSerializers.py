from rest_framework import serializers
from ipsecs.models import ipsecConfiguationItems

class ConfigurationChoicesSerializer(serializers.Serializer):
    authentication_protocol = serializers.SerializerMethodField()
    encryption_protocol = serializers.SerializerMethodField()
    encapsulation_protocol = serializers.SerializerMethodField()
    dh_group = serializers.SerializerMethodField()
    authentication_method = serializers.SerializerMethodField()

    def get_authentication_protocol(self, obj):
        """Returns authentication algorithm choices"""
        return ipsecConfiguationItems.AuthAlgorithm.choices  

    def get_encryption_protocol(self, obj):
        """Returns encryption algorithm choices"""
        return ipsecConfiguationItems.EncryptionAlgorithm.choices  

    def get_encapsulation_protocol(self, obj):
        """Returns encapsulation (ESP/AH) choices"""
        return ipsecConfiguationItems.Protocol.choices  

    def get_dh_group(self, obj):
        """Returns Diffie-Hellman group choices"""
        return ipsecConfiguationItems.dh_group.choices  

    def get_authentication_method(self, obj):
        """Returns authentication method choices (PSK/RSA)"""
        return ipsecConfiguationItems.AuthenticationMethod.choices  
