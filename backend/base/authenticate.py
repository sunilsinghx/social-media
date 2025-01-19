from rest_framework_simplejwt.authentication import JWTAuthentication

class CookiesAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Retrieve the JWT token from the 'access_token' cookie.
        access_token = request.COOKIES.get('access_token')
        
        # If no access token is found in the cookies, return None (authentication fails).
        if not access_token:
            return None
        
        # If the token is present, attempt to validate it using the get_validated_token method.
        validated_token = self.get_validated_token(access_token)
        
        try:
            # Try to retrieve the user associated with the validated token.
            user = self.get_user(validated_token)
        except:
            # If user retrieval fails (invalid token or user doesn't exist), return None.
            return None
        
        # Return the authenticated user and validated token tuple.
        return (user, validated_token)
